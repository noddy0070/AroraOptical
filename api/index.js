// =========================
// Main Express Server Entry
// =========================
// This file sets up the Express server, connects to MongoDB, configures middleware, and registers all API routes.

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js';
import imageRouter from './routes/image.route.js';
import eyeTestRouter from './routes/eyeTest.route.js';
import orderRouter from './routes/order.route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import './utils/passport.js'; // import passport config
// import { createAdminUser } from './utils/createAdmin.js';

// Load environment variables from .env file
dotenv.config();

// Debug log for environment variables (for development only)
console.log('Server Environment:', {
    nodeEnv: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasJwtSecret: !!process.env.JWT_SECRET
});

const app = express();

// ========== MIDDLEWARES ==========
// Parse cookies from incoming requests
app.use(cookieParser());

// Enable CORS for frontend origins and allow credentials (cookies, auth headers)
app.use(cors({
    origin: ['http://localhost:5173', 'https://www.aroraopticals.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
}));

// Parse JSON bodies and urlencoded data
app.use(bodyParser.json());
app.use(express.json());

// Configure session management for authentication
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Vercel
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    }
}));

// Initialize Passport for authentication (local and Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware: log each request's method, path, cookies, session, and user
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        cookies: req.cookies,
        session: req.session,
        user: req.user
    });
    next();
});

// ========== DATABASE ==========
// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO).then(() => {
  console.log("✅ Connected to MongoDB.");
  // Optionally create an admin user after DB connection
  // createAdminUser();
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ========== ROUTES ==========
// Register all API routes
app.use('/api/user', userRouter);      // User management
app.use('/api/auth', authRouter);      // Authentication (local, Google OAuth)
app.use('/api/admin', adminRouter);    // Admin operations
app.use('/api/image', imageRouter);    // Image uploads
app.use('/api/eye-test', eyeTestRouter); // Eye test booking
app.use('/api/order', orderRouter);    // Order management

// ========== ERROR HANDLER ==========
// Centralized error handler for all API errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ========== SERVER ==========
// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
