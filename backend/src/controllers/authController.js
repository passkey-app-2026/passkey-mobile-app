// src/controllers/authController.js
/**
 * Controller layer – thin wrappers around the service functions.
 * Each function receives the Express req/res objects, calls the service,
 * and returns JSON. Errors are passed to the global error handler via next().
 */
import {
  getRegistrationOptions,
  verifyRegistration,
  getLoginOptions,
  verifyLogin,
} from '../services/authService.js';

// 1️⃣ POST /auth/register-options
export const registerOptions = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const options = await getRegistrationOptions(email);
    res.json(options);
  } catch (err) {
    next(err);
  }
};

// 2️⃣ POST /auth/register-verify
export const registerVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await verifyRegistration(email, req.body);
    res.json({ message: 'Passkey registered', userId: result.userId });
  } catch (err) {
    next(err);
  }
};

// 3️⃣ POST /auth/login-options
export const loginOptions = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const options = await getLoginOptions(email);
    res.json(options);
  } catch (err) {
    next(err);
  }
};

// 4️⃣ POST /auth/login-verify (returns JWT)
export const loginVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { token, user } = await verifyLogin(email, req.body);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};
