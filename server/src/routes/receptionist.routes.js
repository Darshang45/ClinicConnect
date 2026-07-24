import express from "express";

import {
  getTodayAppointments,
  checkInPatient,
  startConsultation,
  completeAppointment,
  cancelAppointment,
} from "../controllers/receptionist.controller.js";

const router = express.Router();

// Today's Appointments
router.get("/today-appointments", getTodayAppointments);
router.patch("/check-in/:appointmentId", checkInPatient);
router.patch("/start-consultation/:appointmentId", startConsultation);
router.patch("/complete/:appointmentId", completeAppointment);
router.patch("/cancel/:appointmentId", cancelAppointment);
export default router;
