import express from "express";
// import { protect } from "../middleware/auth.middleware.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed Successfully",
    user: req.user,
  });
});

router.get(
  "/doctor-dashboard",
  protect,
  authorize("doctor"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Doctor!",
    });
  }
);

export default router;