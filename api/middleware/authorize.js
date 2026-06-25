import User from "../models/user.model.js";

/**
 * Role-based authorization middleware factory.
 * Usage: authorize('super-admin', 'admin')
 * Requires authMiddleware to run first (sets req.user).
 */
export const authorize = (...allowedRoles) => async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const user = await User.findById(req.user.id).select("role");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    if (!allowedRoles.includes(user.role)) {
      console.warn(
        `[RBAC] 403 – role '${user.role}' denied on ${req.method} ${req.path} (allowed: ${allowedRoles.join(', ')})`
      );
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires: ${allowedRoles.filter(r => r !== 'admin').join(' or ')}`,
      });
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    console.error("authorize error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
