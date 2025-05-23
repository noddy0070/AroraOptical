import express from "express";
import {test,update} from "../controllers/user.controller.js";
import { getPolicy } from "../controllers/policy.controller.js";
const router = express.Router();

router.get('/test',test);
router.post('/update/:id',update);
router.get('/get-policy/:id',getPolicy);
export default router;