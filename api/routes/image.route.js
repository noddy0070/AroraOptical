import express from "express";
// import {test,update} from "../controllers/user.controller.js";
const router = express.Router();
import {test,generate_signature,delete_image} from '../controllers/image.controller.js';

router.get('/health',test);
router.post('/generate-signature',generate_signature);
router.post('/delete-image',delete_image);
export default router;