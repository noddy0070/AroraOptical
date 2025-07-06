import express from "express";
import {test,update, addToCart, removeFromCart, updateCartQuantity, addToWishlist, removeFromWishlist, getCartItems, getWishlistItems, addAddressToList, removeAddressFromList, editAddressInList} from "../controllers/user.controller.js";
import { getPolicy } from "../controllers/policy.controller.js";
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',update);
router.get('/get-policy/:id',getPolicy);

// Cart routes
router.post('/cart/add', addToCart);
router.post('/cart/remove', removeFromCart);
router.post('/cart/update-quantity', updateCartQuantity);
router.get('/cart/:userId', getCartItems);

// Wishlist routes
router.post('/wishlist/add', addToWishlist);
router.post('/wishlist/remove', removeFromWishlist);
router.get('/wishlist/:userId', getWishlistItems);

router.post('/address/add/:id', addAddressToList);
router.post('/address/remove/:id', removeAddressFromList);
router.post('/address/edit/:id', editAddressInList);

export default router;