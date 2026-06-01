// src/models/User.js
// Mongoose model for Passkey Auth App users

import mongoose from 'mongoose';

const PasskeySchema = new mongoose.Schema({
  credentialID: { type: String, required: true },
  publicKey: { type: String, required: true },
  counter: { type: Number, default: 0 },
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    // An array of registered passkeys for the user
    passkeys: { type: [PasskeySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
