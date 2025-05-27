import express from "express";
import {signup,login,me,logout,sendOTP, verifyOTP,googleCallback} from "../controllers/auth.controller.js";
import {authMiddleware} from '../middleware/auth.js';
import passport from "passport";
const router= express.Router();

// Debug middleware to log route access
const logRoute = (req, res, next) => {
    console.log(`Route accessed: ${req.method} ${req.originalUrl}`);
    next();
};

router.use(logRoute); // Apply logging to all routes

router.post('/signup',signup);
router.post('/signin',login);
router.get('/me',authMiddleware,me);
router.post('/logout',authMiddleware,logout)
router.post('/send-otp',sendOTP);
router.post('/verify-otp',verifyOTP);

// Google OAuth routes with explicit callback URL
const CALLBACK_URL = process.env.NODE_ENV === 'production'
    ? 'https://arora-optical-backend.vercel.app/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback';

// Google OAuth routes
router.get('/google', 
    (req, res, next) => {
        console.log('Starting Google OAuth flow, callback URL:', CALLBACK_URL);
        next();
    },
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account',
        callbackURL: CALLBACK_URL
    })
);

router.get('/google/callback', 
    (req, res, next) => {
        console.log('Received Google callback at:', req.originalUrl);
        next();
    },
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=GoogleAuthFailed`,
        session: false,
        callbackURL: CALLBACK_URL
    }),
    googleCallback
);

export default router;