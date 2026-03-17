import User from "../models/user.model.js";

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

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("verifyAdmin error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

export { verifyAdmin };

