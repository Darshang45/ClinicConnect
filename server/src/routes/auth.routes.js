import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { sendEmail } from "../utils/sendEmail.js";

import {
  login,
  getCurrentUser,
  changePassword,
  sendPatientOtp,
  verifyPatientOtp,
  resendPatientOtp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", authenticate, getCurrentUser);

router.put("/change-password", authenticate, changePassword);

router.post("/patient/send-otp", sendPatientOtp);

router.post("/patient/verify-otp", verifyPatientOtp);

router.post("/patient/resend-otp", resendPatientOtp);

// router.get("/test-email", async (req, res) => {
//   try {

//     await sendEmail(
//       "clinicconnect.auth@gmail.com",
//       "Clinic Connect Email Test",
//       `
//       <h2>Email Service Working!</h2>

//       <p>This email confirms that Nodemailer is configured correctly.</p>

//       <p>You can now start implementing Email OTP Authentication.</p>
//       `
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Test email sent successfully.",
//     });

//   } catch (error) {

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// });

export default router;
