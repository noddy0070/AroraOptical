import express from "express";
// import {signup,signin, sendOTP, verifyOTP} from "../controllers/auth.controller.js";
import { addProduct,getProducts,getSingleProduct,getProductsColor,updateProduct,deleteProduct } from "../controllers/product.controller.js";
import { addAttributes,getAttributes,deleteAttribute,editAttribute } from "../controllers/attributes.controller.js";
import { getUsers,addUser,getUser } from "../controllers/user.controller.js";
import { addPolicy,updatePolicy,getPolicy} from "../controllers/policy.controller.js";
const router= express.Router();


// Products Routes
router.post('/add-product',addProduct);
router.delete('/delete-product/:id',deleteProduct);
router.post('/update-product/:id',updateProduct);
router.get('/get-products',getProducts);
router.get('/get-single-product/:attributeId',getSingleProduct);
router.post('/get-products-color',getProductsColor); 

// Attributes Routes
router.post('/add-attributes',addAttributes);
router.post('/edit-attributes',addProduct);
router.get('/get-attributes',getAttributes);
router.delete('/delete-attributes/:attributeId',deleteAttribute);
router.put('/edit-attributes', editAttribute);

// Admin Control over User Routes
router.get('/get-users',getUsers);
router.post('/add-user',addUser);
router.get('/get-user/:id',getUser);

// Admin Control Over Policies
router.post('/add-cancellation-policy',addPolicy)
router.post('/update-policy/:id',updatePolicy);
router.get('/get-policy/:id',getPolicy);

export default router;