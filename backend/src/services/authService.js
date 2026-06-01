// src/services/authService.js
/**
 * Service layer that wraps @simplewebauthn/server and DB operations.
 * All functions return plain JS objects – the controller decides HTTP status / messages.
 */

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/* ------------------------------------------------------------------ *
 * 1️⃣  Registration (Passkey creation)
 * ------------------------------------------------------------------ */

/**
 * Build WebAuthn registration options for a given email.
 * The returned object contains a `challenge` that the client must sign.
 */
export const getRegistrationOptions = async (email) => {
  // Find (or create) the user document first
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, passkeys: [] });
  }

  const opts = generateRegistrationOptions({
    rpName: process.env.RP_NAME,
    rpID: process.env.RP_ID,
    // userID must be a Buffer/Uint8Array – convert the Mongo ObjectId string to a Buffer
    userID: Buffer.from(user._id.toString()),
    userName: user.email,
    timeout: 60000,
    attestationType: 'none',
    // Existing credentials are needed to avoid duplicate registration
    excludeCredentials: user.passkeys.map((pk) => ({
      id: Buffer.from(pk.credentialID, 'base64url'),
      type: 'public-key',
      transports: ['usb', 'ble', 'nfc', 'internal'],
    })),
  });

  // Store the challenge temporarily on the user (could also use Redis)
  user.currentChallenge = opts.challenge;
  await user.save();

  return opts;
};

/**
 * Verify the registration response coming from the client.
 * If successful, we store the new passkey in the user document.
 */
export const verifyRegistration = async (email, registrationResponse) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const verification = await verifyRegistrationResponse({
    credential: registrationResponse,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: process.env.ORIGIN,
    expectedRPID: process.env.RP_ID,
  });

  if (!verification.verified) throw new Error('Registration verification failed');

  const { credentialPublicKey, credentialID, counter } = verification;
  user.passkeys.push({
    credentialID: Buffer.from(credentialID).toString('base64url'),
    publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
    counter,
  });
  user.currentChallenge = undefined;
  await user.save();

  return { userId: user._id };
};

/* ------------------------------------------------------------------ *
 * 2️⃣  Authentication (Passkey login)
 * ------------------------------------------------------------------ */

/**
 * Generate authentication (login) options (challenge) for the email.
 */
export const getLoginOptions = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const opts = generateAuthenticationOptions({
    rpID: process.env.RP_ID,
    timeout: 60000,
    allowCredentials: user.passkeys.map((pk) => ({
      id: Buffer.from(pk.credentialID, 'base64url'),
      type: 'public-key',
      transports: ['usb', 'ble', 'nfc', 'internal'],
    })),
    userVerification: 'preferred',
  });

  user.currentChallenge = opts.challenge;
  await user.save();

  return opts;
};

/**
 * Verify the authentication response and issue a JWT.
 */
export const verifyLogin = async (email, authenticationResponse) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Find the stored public key for the credential being verified
  const storedPasskey = user.passkeys.find(
    (pk) => pk.credentialID === Buffer.from(authenticationResponse.id, 'base64url').toString('base64url')
  );
  if (!storedPasskey) throw new Error('Credential not registered');

  const verification = await verifyAuthenticationResponse({
    credential: authenticationResponse,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: process.env.ORIGIN,
    expectedRPID: process.env.RP_ID,
    credentialPublicKey: Buffer.from(storedPasskey.publicKey, 'base64url'),
    credentialCurrentCounter: storedPasskey.counter,
  });

  if (!verification.verified) throw new Error('Authentication failed');

  // Update the counter to prevent replay attacks
  storedPasskey.counter = verification.newCounter;
  user.currentChallenge = undefined;
  await user.save();

  // ---------- JWT ---------------------------------------------------
  const jwt = require('jsonwebtoken');
  const payload = { sub: user._id.toString(), email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

  return { token, user };
};
