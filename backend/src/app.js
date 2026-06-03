// Main Express application setup

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global middlewares
app.use(express.json()); // parse JSON bodies
app.use(cors({ origin: process.env.ORIGIN })); // allow only our frontend origin
app.use(helmet()); // security headers
app.use(morgan('dev'));

// Rate limiting – 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Basic health check
app.get('/', (req, res) => res.send('Passkey Auth API is running'));

export default app;
