import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  trackOrder,
  checkServiceability,
  cancelOrder,
  getCourierList,
  getPickupLocations,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../controllers/order.controller.js';

const router = express.Router();

// Public routes
router.get('/serviceability', checkServiceability);
router.get('/couriers', getCourierList);
router.get('/pickup-locations', getPickupLocations);

// Protected routes (require authentication)
router.post('/create', authMiddleware, createOrder);
router.get('/user-orders', authMiddleware, getUserOrders);
router.get('/:orderId', authMiddleware, getOrder);
router.get('/:orderId/track', authMiddleware, trackOrder);
router.post('/:orderId/cancel', authMiddleware, cancelOrder);
router.post('/razorpay-order', authMiddleware, createRazorpayOrder);
router.post('/verify-razorpay', authMiddleware, verifyRazorpayPayment);

// Admin routes
router.get('/admin/all', authMiddleware, getAllOrders);
router.put('/admin/:orderId/status', authMiddleware, updateOrderStatus);

export default router; 