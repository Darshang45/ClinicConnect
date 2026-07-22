import express from "express";

import { bookAppointment } from "../controllers/appointment.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Patient or Receptionist can book
router.post(
  "/",
  protect,
  authorize("patient", "receptionist"),
  bookAppointment
);

export default router;