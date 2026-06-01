// src/middleware/authJwt.js
// Middleware that validates JWT on protected routes

import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or malformed token' });
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request for later handlers
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    console.error('🔐 JWT error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
