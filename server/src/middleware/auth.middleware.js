import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ======================================
// Authentication Middleware
// ======================================

export const authenticate = async (req, res, next) => {
  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not provided.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive.",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });

  }
};

// ======================================
// Authorization Middleware
// ======================================

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();
    const allowedRoles = roles.map((r) => String(r).toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      // TEMPORARY DIAGNOSTIC — remove after confirming fix
      console.warn(
        `[AUTH] 403 on ${req.method} ${req.originalUrl} | user._id=${req.user._id} | db_role="${req.user.role}" | required_roles=${JSON.stringify(roles)}`
      );
      return res.status(403).json({
        success: false,
        message: "Access denied.",
        // TEMPORARY — remove after confirming fix:
        _debug: { db_role: req.user.role, required: roles },
      });
    }

    next();
  };
};