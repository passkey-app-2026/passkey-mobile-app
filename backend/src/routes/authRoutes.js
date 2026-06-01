// src/routes/authRoutes.js
import { Router } from 'express';
import {
  registerOptions,
  registerVerify,
  loginOptions,
  loginVerify,
} from '../controllers/authController.js';

const router = Router();

// Registration flow
router.post('/register-options', registerOptions);
router.post('/register-verify', registerVerify);

// Login flow
router.post('/login-options', loginOptions);
router.post('/login-verify', loginVerify);

export default router;
