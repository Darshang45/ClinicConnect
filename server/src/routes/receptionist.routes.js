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
  getReceptionistDepartments,
  getReceptionistDoctors,
  getReceptionistAvailableSlots,
  getDoctorsStatus,
  updateDoctorStatus,
} from "../controllers/receptionist.controller.js";

import {
  getAvailableDoctors,
  getAvailableDepartments,
} from "../controllers/patient.controller.js";

const router = express.Router();

// Live Doctor Availability Status
router.get(
  "/doctors/status",
  authenticate,
  authorize("receptionist", "admin"),
  getDoctorsStatus,
);

router.patch(
  "/doctors/:id/status",
  authenticate,
  authorize("receptionist", "admin"),
  updateDoctorStatus,
);

// Today's Appointments
router.get(
  "/today-appointments",
  authenticate,
  authorize("receptionist", "admin"),
  getTodayAppointments,
);

router.get(
  "/dashboard",
  authenticate,
  authorize("receptionist"),
  getReceptionistDashboard,
);

router.get(
  "/dashboard/pending-checkins",
  authenticate,
  authorize("receptionist"),
  getPendingCheckIns,
);

// Departments for walk-in registration
router.get(
  "/departments",
  authenticate,
  authorize("receptionist"),
  getReceptionistDepartments,
);

// Doctors for walk-in registration
router.get(
  "/doctors",
  authenticate,
  authorize("receptionist"),
  getReceptionistDoctors,
);

// Available appointment slots
router.get(
  "/available-slots",
  authenticate,
  authorize("receptionist"),
  getReceptionistAvailableSlots,
);

router.post(
  "/walk-in",
  authenticate,
  authorize("receptionist"),
  createWalkInAppointment,
);

router.get(
  "/dashboard/walkins",
  authenticate,
  authorize("receptionist"),
  getTodayWalkIns,
);

router.get(
  "/dashboard/queue",
  authenticate,
  authorize("receptionist"),
  getQueue,
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


export default router;
