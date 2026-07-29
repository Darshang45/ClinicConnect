import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";


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
  getUpcomingAppointments,
  getRecentPatients,
  getRecentPrescriptions,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createDoctor);

router.get("/", authenticate, authorize("admin", "receptionist"), getDoctors);

router.get(
  "/search",
  authenticate,
  authorize("admin", "receptionist"),
  searchDoctors,
);

router.get(
  "/dashboard/upcoming",
  authenticate,
  authorize("doctor"),
  getUpcomingAppointments,
);

router.get(
  "/dashboard/patients",
  authenticate,
  authorize("doctor"),
  getRecentPatients,
);

router.get(
  "/dashboard/prescriptions",
  authenticate,
  authorize("doctor"),
  getRecentPrescriptions,
);

router.get(
  "/department/:departmentId",
  authenticate,
  authorize("admin", "receptionist", "patient"),
  getDoctorsByDepartment,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "doctor", "receptionist"),
  getDoctorById,
);

router.put("/:id", authenticate, authorize("admin", "doctor"), updateDoctor);

router.delete("/:id", authenticate, authorize("admin"), deleteDoctor);

router.get("/today-appointments/:doctorId", getTodayAppointments);

router.get("/appointment/:appointmentId", getAppointmentDetails);

router.get("/patient-history/:patientId", getPatientHistory);

router.put("/start-consultation/:appointmentId", startConsultation);

router.put("/complete-consultation/:appointmentId", completeConsultation);

export default router;
