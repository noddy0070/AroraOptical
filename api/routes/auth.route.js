import express from "express";
import {signup,signin, sendOTP, verifyOTP} from "../controllers/auth.controller.js";

const router= express.Router();


router.post('/signup',signup);
router.post('/signin',signin);
router.post('/sendOTP',sendOTP);
router.post('/verifyOTP',verifyOTP);
export default router;