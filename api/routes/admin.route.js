import express from "express";
// import {signup,signin, sendOTP, verifyOTP} from "../controllers/auth.controller.js";
import { addProduct,getProducts,getSingleProduct } from "../controllers/product.controller.js";
import { addAttributes,getAttributes,deleteAttribute,editAttribute } from "../controllers/attributes.controller.js";
const router= express.Router();


router.post('/add-product',addProduct);
router.get('/get-products',getProducts);
router.get('/get-single-product/:attributeId',getSingleProduct);
router.post('/add-attributes',addAttributes);
router.post('/edit-attributes',addProduct);
router.get('/get-attributes',getAttributes);
router.delete('/delete-attributes/:attributeId',deleteAttribute);
router.put('/edit-attributes', editAttribute); 
export default router;