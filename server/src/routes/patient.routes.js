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
  getAppointmentDetails,
  rescheduleAppointment,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("receptionist", "admin", "doctor"),
  createPatient
);

router.get(
  "/",
  authenticate,
  authorize("receptionist", "doctor", "admin"),
  getPatients
);

router.get(
  "/search",
  authenticate,
  authorize("receptionist", "doctor", "admin"),
  searchPatients
);

router.get(
  "/dashboard",
  authenticate,
  authorize("patient"),
  getPatientDashboard,
);

router.get("/profile", authenticate, authorize("patient"), getMyProfile);

router.put("/profile", authenticate, authorize("patient"), updateMyProfile);

router.get(
  "/appointments",
  authenticate,
  authorize("patient"),
  getUpcomingAppointments,
);

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
  "/appointments/:appointmentId/cancel",
  authenticate,
  authorize("patient"),
  cancelAppointment,
);

router.get(
  "/appointments/:appointmentId/details",
  authenticate,
  authorize("patient"),
  getAppointmentDetails,
);

router.patch(
  "/appointments/:appointmentId/reschedule",
  authenticate,
  authorize("patient"),
  rescheduleAppointment,
);

router.get(
  "/phone/:phone",
  authenticate,
  authorize("receptionist", "doctor", "admin"),
  getPatientByPhone
);

router.get(
  "/:id",
  authenticate,
  authorize("receptionist", "doctor", "admin"),
  getPatientById
);

router.put(
  "/:id",
  authenticate,
  authorize("receptionist", "admin"),
  updatePatient
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "receptionist"),
  deletePatient
);

export default router;
