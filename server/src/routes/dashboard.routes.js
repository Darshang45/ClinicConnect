import express from "express";
import {
  getAdminDashboard,
  getDoctorDashboard,
  getReceptionistDashboard,
  getPatientDashboard,
  getPharmacyDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// Admin Dashboard
router.get("/admin", getAdminDashboard);

// Receptionist Dashboard
router.get("/receptionist", getReceptionistDashboard);

// Doctor Dashboard
router.get("/doctor/:doctorId", getDoctorDashboard);

// Patient Dashboard
router.get("/patient/:patientId", getPatientDashboard);

// Pharmacy Dashboard
router.get("/pharmacy", getPharmacyDashboard);

export default router;