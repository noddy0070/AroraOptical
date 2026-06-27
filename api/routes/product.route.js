import express from 'express';
import {
  addProduct,
  getProducts,
  getAccessories,
  getProductsColor,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  testProducts,
  addReview
} from '../controllers/product.controller.js';

const router = express.Router();

// Product routes
router.post('/add', addProduct);
router.get('/get', getProducts);
router.get('/accessories', getAccessories);
router.post('/get-color', getProductsColor);
router.get('/test', testProducts);
router.get('/search', searchProducts);
router.post('/:attributeId/review', addReview);
router.get('/:attributeId', getSingleProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

