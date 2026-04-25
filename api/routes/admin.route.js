import express from "express";
import {
  addProduct,
  getProducts,
  getSingleProduct,
  getProductsColor,
  updateProduct,
  deleteProduct,
  getAccessories,
  bulkAddProducts,
} from "../controllers/product.controller.js";
import {
  addAttributes,
  getAttributes,
  deleteAttribute,
  editAttribute,
} from "../controllers/attributes.controller.js";
import {
  getUsers,
  addUser,
  getUser,
  toggleBlockUser,
} from "../controllers/user.controller.js";
import { addPolicy, updatePolicy, getPolicy } from "../controllers/policy.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();


// Products Routes
router.post("/add-product", authMiddleware, verifyAdmin, addProduct);
router.post(
  "/bulk-add-products",
  authMiddleware,
  verifyAdmin,
  bulkAddProducts
);

router.delete(
  "/delete-product/:id",  
  authMiddleware,
  verifyAdmin,
  deleteProduct
);
router.post(
  "/update-product/:id",
  authMiddleware,
  verifyAdmin,
  updateProduct
);
router.get("/get-products", authMiddleware, verifyAdmin, getProducts);
router.get(
  "/get-single-product/:attributeId",
  authMiddleware,
  verifyAdmin,
  getSingleProduct
);
router.post(
  "/get-products-color",
  authMiddleware,
  verifyAdmin,
  getProductsColor
);
router.get(
  "/get-accessories",
  authMiddleware,
  verifyAdmin,
  getAccessories
);

// Attributes Routes
router.post("/add-attributes", authMiddleware, verifyAdmin, addAttributes);
router.post("/edit-attributes", authMiddleware, verifyAdmin, addProduct);
router.get("/get-attributes", authMiddleware, verifyAdmin, getAttributes);
router.delete(
  "/delete-attributes/:attributeId",
  authMiddleware,
  verifyAdmin,
  deleteAttribute
);
router.put(
  "/edit-attributes",
  authMiddleware,
  verifyAdmin,
  editAttribute
);

// Admin Control over User Routes
router.get("/get-users", authMiddleware, verifyAdmin, getUsers);
router.post("/add-user", authMiddleware, verifyAdmin, addUser);
router.get("/get-user/:id", authMiddleware, verifyAdmin, getUser);
router.post(
  "/toggle-block-user/:id",
  authMiddleware,
  verifyAdmin,
  toggleBlockUser
);

// Admin Control Over Policies
router.post(
  "/add-cancellation-policy",
  authMiddleware,
  verifyAdmin,
  addPolicy
);
router.post(
  "/update-policy/:id",
  authMiddleware,
  verifyAdmin,
  updatePolicy
);
router.get(
  "/get-policy/:id",
  authMiddleware,
  verifyAdmin,
  getPolicy
);

export default router;