import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { getDepartments } from "../controllers/department.controller.js";
import { getDoctors } from "../controllers/doctor.controller.js";
import { bookAppointment } from "../controllers/appointment.controller.js";
import { cancelAppointment } from "../controllers/receptionist.controller.js";

import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientByPhone,
  getPatientDashboard,
  getMyProfile,
  updateMyProfile,
  getUpcomingAppointments,
  getMyPrescriptions,
  getAvailableDoctors,
  getAvailableDepartments,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);

router.get("/", getPatients);

router.get("/search", searchPatients);

router.get(
  "/dashboard",
  authenticate,
  authorize("patient"),
  getPatientDashboard,
);

router.get("/profile", authenticate, authorize("patient"), getMyProfile);

router.put("/profile", authenticate, authorize("patient"), updateMyProfile);

router.get(
  "/appointments/upcoming",
  authenticate,
  authorize("patient"),
  getUpcomingAppointments,
);

router.get(
  "/prescriptions",
  authenticate,
  authorize("patient"),
  getMyPrescriptions,
);

router.post(
  "/appointments",
  authenticate,
  authorize("patient"),
  bookAppointment,
);

router.get("/departments", authenticate, authorize("patient"), getAvailableDepartments);

router.get("/doctors", authenticate, authorize("patient"), getAvailableDoctors);

router.put(
  "/appointments/:id/cancel",
  authenticate,
  authorize("patient"),
  cancelAppointment,
);

router.get("/phone/:phone", getPatientByPhone);

router.get("/:id", getPatientById);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;
