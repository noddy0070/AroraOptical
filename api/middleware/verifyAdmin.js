import User from "../models/user.model.js";

const ADMIN_ROLES = ['admin', 'super-admin', 'product-manager'];

const verifyAdmin = async (req, res, next) => {
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

    if (!ADMIN_ROLES.includes(user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    console.error("verifyAdmin error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

export { verifyAdmin };

