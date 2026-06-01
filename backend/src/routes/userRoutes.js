// src/routes/userRoutes.js
import { Router } from 'express';
import { getProfile } from '../controllers/userController.js';
import { verifyJwt } from '../middleware/authJwt.js';

const router = Router();

// Apply JWT verification to all routes in this router
router.use(verifyJwt);

// GET /user/profile – returns the logged‑in user's profile (email, timestamps)
router.get('/profile', getProfile);

export default router;
