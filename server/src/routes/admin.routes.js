import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

import {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAppointmentStatistics,
  getRecentAppointments,
  getDepartmentStatistics,
  getDoctorStatistics,
  getTodayDashboard,
  getAdminDashboard,
  getRecentDoctors,
  getRecentPatients,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createAdmin);

router.get("/", authenticate, authorize("admin"), getAdmins);


router.get(
  "/dashboard/appointments",
  authenticate,
  authorize("admin"),
  getAppointmentStatistics,
);

router.get(
  "/dashboard/recent",
  authenticate,
  authorize("admin"),
  getRecentAppointments,
);

router.get(
  "/dashboard/departments",
  authenticate,
  authorize("admin"),
  getDepartmentStatistics,
);

router.get(
  "/dashboard/doctors",
  authenticate,
  authorize("admin"),
  getDoctorStatistics,
);

router.get(
  "/dashboard/today",
  authenticate,
  authorize("admin"),
  getTodayDashboard,
);

router.get("/dashboard", authenticate, authorize("admin"), getAdminDashboard);

router.get(
  "/dashboard/recent-doctors",
  authenticate,
  authorize("admin"),
  getRecentDoctors,
);

router.get(
  "/dashboard/recent-patients",
  authenticate,
  authorize("admin"),
  getRecentPatients,
);

router.get("/:id", authenticate, authorize("admin"), getAdminById);

router.put("/:id", authenticate, authorize("admin"), updateAdmin);

router.delete("/:id", authenticate, authorize("admin"), deleteAdmin);

export default router;
