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
  deleteUser,
} from "../controllers/user.controller.js";
import { addPolicy, updatePolicy, getPolicy } from "../controllers/policy.controller.js";
import { getAdminStats, getNotifications, markNotificationsRead } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Roles that can manage products and attributes (all admin roles)
const anyAdmin = ['admin', 'super-admin', 'product-manager'];
// Roles that can manage users, orders, policies, and settings (super-admin only)
const superAdminOnly = ['admin', 'super-admin'];

// ── Dashboard Stats (super-admin only) ──────────────────────────────────────
router.get("/stats", authMiddleware, authorize(...superAdminOnly), getAdminStats);

// ── Notifications (super-admin only) ────────────────────────────────────────
router.get("/notifications",           authMiddleware, authorize(...superAdminOnly), getNotifications);
router.put("/notifications/mark-read", authMiddleware, authorize(...superAdminOnly), markNotificationsRead);

// ── Products (product-manager + super-admin) ────────────────────────────────
router.post("/add-product",              authMiddleware, authorize(...anyAdmin), addProduct);
router.post("/bulk-add-products",        authMiddleware, authorize(...anyAdmin), bulkAddProducts);
router.delete("/delete-product/:id",     authMiddleware, authorize(...anyAdmin), deleteProduct);
router.post("/update-product/:id",       authMiddleware, authorize(...anyAdmin), updateProduct);
router.get("/get-products",              authMiddleware, authorize(...anyAdmin), getProducts);
router.get("/get-single-product/:attributeId", authMiddleware, authorize(...anyAdmin), getSingleProduct);
router.post("/get-products-color",       authMiddleware, authorize(...anyAdmin), getProductsColor);
router.get("/get-accessories",           authMiddleware, authorize(...anyAdmin), getAccessories);

// ── Attributes (product-manager + super-admin) ──────────────────────────────
router.post("/add-attributes",           authMiddleware, authorize(...anyAdmin), addAttributes);
router.post("/edit-attributes",          authMiddleware, authorize(...anyAdmin), addProduct);
router.get("/get-attributes",            authMiddleware, authorize(...anyAdmin), getAttributes);
router.delete("/delete-attributes/:attributeId", authMiddleware, authorize(...anyAdmin), deleteAttribute);
router.put("/edit-attributes",           authMiddleware, authorize(...anyAdmin), editAttribute);

// ── User Management (super-admin only) ──────────────────────────────────────
router.get("/get-users",                 authMiddleware, authorize(...superAdminOnly), getUsers);
router.post("/add-user",                 authMiddleware, authorize(...superAdminOnly), addUser);
router.get("/get-user/:id",              authMiddleware, authorize(...superAdminOnly), getUser);
router.post("/toggle-block-user/:id",    authMiddleware, authorize(...superAdminOnly), toggleBlockUser);
router.delete("/delete-user/:id",        authMiddleware, authorize(...superAdminOnly), deleteUser);

// ── Policies (super-admin only) ─────────────────────────────────────────────
router.post("/add-cancellation-policy",  authMiddleware, authorize(...superAdminOnly), addPolicy);
router.post("/update-policy/:id",        authMiddleware, authorize(...superAdminOnly), updatePolicy);
router.get("/get-policy/:id",            authMiddleware, verifyAdmin, getPolicy);

export default router;
