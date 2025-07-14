import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
// import { verifyAdmin } from '../middleware/verifyAdmin.js';
import {
  getAvailableTimeSlots,
  bookEyeTest,
  getAllEyeTests,
  getUserEyeTests,
  updateEyeTestStatus,
  getEyeTestDetails
} from '../controllers/eyeTest.controller.js';

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableTimeSlots);

// Protected routes (require user authentication)
router.post('/book',  bookEyeTest);
router.get('/user-tests',authMiddleware,  getUserEyeTests);
router.get('/details/:id' , authMiddleware, getEyeTestDetails);

// Admin routes
router.get('/all',authMiddleware,  getAllEyeTests);
router.put('/status/:id',authMiddleware, updateEyeTestStatus);

export default router; 