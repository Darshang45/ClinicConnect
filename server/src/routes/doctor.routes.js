import express from "express";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
  getDoctorsByDepartment,
  getTodayAppointments,
  getAppointmentDetails,
  getPatientHistory,
  startConsultation,
  completeConsultation,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/", createDoctor);

router.get("/", getDoctors);

router.get("/search", searchDoctors);

router.get("/department/:departmentId", getDoctorsByDepartment);

router.get("/:id", getDoctorById);

router.put("/:id", updateDoctor);

router.delete("/:id", deleteDoctor);

router.get("/today-appointments/:doctorId", getTodayAppointments);

router.get("/appointment/:appointmentId", getAppointmentDetails);

router.get("/patient-history/:patientId", getPatientHistory);

router.put("/start-consultation/:appointmentId", startConsultation);

router.put("/complete-consultation/:appointmentId", completeConsultation);

export default router;
