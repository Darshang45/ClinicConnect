import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
  toggleDepartmentStatus,
} from "../controllers/department.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createDepartment);

router.get(
  "/",
  authenticate,
  authorize("admin", "doctor", "receptionist", "patient"),
  getDepartments,
);

router.get("/search", searchDepartments);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "doctor", "receptionist", "patient"),
  getDepartmentById,
);

router.put("/:id", authenticate, authorize("admin"), updateDepartment);

router.put("/:id/toggle-status", toggleDepartmentStatus);

router.delete("/:id", authenticate, authorize("admin"), deleteDepartment);

export default router;
