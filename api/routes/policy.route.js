import express from "express";
import { getPolicy } from "../controllers/policy.controller.js";

const router = express.Router();

// Public, read-only policy fetch for storefront pages
router.get("/:id", getPolicy);

export default router;

