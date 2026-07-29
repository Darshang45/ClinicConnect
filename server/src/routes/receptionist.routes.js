import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  getTodayAppointments,
  checkInPatient,
  startConsultation,
  completeAppointment,
  cancelAppointment,
  createWalkInAppointment,
  getReceptionistDashboard,
  getPendingCheckIns,
  getTodayWalkIns,
  getQueue,
} from "../controllers/receptionist.controller.js";

const router = express.Router();

// Today's Appointments
router.get(
  "/today-appointments",
  authenticate,
  authorize( "receptionist", "admin"),
  getTodayAppointments,
);

router.get(
  "/dashboard",
  authenticate,
  authorize("receptionist"),
  getReceptionistDashboard
);

router.get(
  "/dashboard/pending-checkins",
  authenticate,
  authorize("receptionist"),
  getPendingCheckIns
);

router.get(
  "/dashboard/walkins",
  authenticate,
  authorize("receptionist"),
  getTodayWalkIns
);

router.get(
  "/dashboard/queue",
  authenticate,
  authorize("receptionist"),
  getQueue
);

router.patch(
  "/check-in/:appointmentId",
  authenticate,
  authorize("receptionist"),
  checkInPatient,
);

router.patch(
  "/start-consultation/:appointmentId",
  authenticate,
  authorize("receptionist"),
  startConsultation,
);

router.patch(
  "/complete/:appointmentId",
  authenticate,
  authorize("receptionist"),
  completeAppointment,
);

router.patch(
  "/cancel/:appointmentId",
  authenticate,
  authorize("patient", "receptionist", "admin"),
  cancelAppointment,
);

router.post(
  "/walk-in",
  authenticate,
  authorize("receptionist"),
  createWalkInAppointment,
);

export default router;
