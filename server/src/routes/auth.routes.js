import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { sendEmail } from "../utils/sendEmail.js";
import {verifyRegistrationToken} from "../middleware/registration.middleware.js"

import {
  login,
  getCurrentUser,
  changePassword,
  sendPatientOtp,
  verifyPatientOtp,
  resendPatientOtp,
  completePatientProfile,
  staffForgotPassword,
  verifyStaffForgotPasswordOtp,
  resetStaffPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);

router.post(
  "/patient/complete-profile",
  verifyRegistrationToken,
  completePatientProfile,
);

router.get("/me", authenticate, getCurrentUser);

router.put("/change-password", authenticate, changePassword);

router.post("/patient/send-otp", sendPatientOtp);

router.post("/patient/verify-otp", verifyPatientOtp);

router.post("/patient/resend-otp", resendPatientOtp);

// Staff Forgot Password Routes
router.post("/staff/forgot-password", staffForgotPassword);
router.post("/staff/verify-forgot-password-otp", verifyStaffForgotPasswordOtp);
router.post("/staff/reset-password", resetStaffPassword);

export default router;
