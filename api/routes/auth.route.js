import express from "express";
import {signup,login,me,logout,sendOTP, verifyOTP,googleCallback} from "../controllers/auth.controller.js";
import {authMiddleware} from '../middleware/auth.js';
import passport from "passport";
const router= express.Router();


router.post('/signup',signup);
router.post('/signin',login);
router.get('/me',authMiddleware,me);
router.post('/logout',logout)
router.post('/send-otp',sendOTP);
router.post('/verify-otp',verifyOTP);
router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }),googleCallback);

export default router;