import express from "express";

import {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDashboardOverview,
  getAppointmentStatistics,
  getRecentAppointments,
  getDepartmentStatistics,
  getDoctorStatistics,
  getTodayDashboard,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", createAdmin);

router.get("/", getAdmins);

router.get("/dashboard", getDashboardOverview);

router.get("/dashboard/appointments", getAppointmentStatistics);

router.get("/dashboard/recent", getRecentAppointments);

router.get("/dashboard/departments", getDepartmentStatistics);

router.get("/dashboard/doctors", getDoctorStatistics);

router.get("/dashboard/today", getTodayDashboard);

router.get("/:id", getAdminById);

router.put("/:id", updateAdmin);

router.delete("/:id", deleteAdmin);

export default router;
