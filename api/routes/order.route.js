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
  getOrderStatus,
  createPhonepeOrder,
  createCODOrder,
  createMockOrder,
  deleteOrder,
  getDelhiveryWarehouses,
} from '../controllers/order.controller.js';

const router = express.Router();

// Public routes
router.get('/serviceability', checkServiceability);

// Protected routes (require authentication)
router.post('/create', authMiddleware, createOrder);
router.post('/create-phonepe', authMiddleware, createPhonepeOrder);
router.post('/create-cod', authMiddleware, createCODOrder);
router.post('/create-mock', authMiddleware, createMockOrder);
router.get('/status', getOrderStatus);

router.get('/user-orders', authMiddleware, getUserOrders);
router.get('/:orderId', authMiddleware, getOrder);
router.get('/:orderId/track', authMiddleware, trackOrder);
router.post('/:orderId/cancel', authMiddleware, cancelOrder);


// Admin routes
router.get('/admin/delhivery-warehouses', authMiddleware, getDelhiveryWarehouses);
router.get('/admin/all', authMiddleware, getAllOrders);
router.put('/admin/:orderId/status', authMiddleware, updateOrderStatus);
router.delete('/admin/:orderId', authMiddleware, deleteOrder);

export default router; 