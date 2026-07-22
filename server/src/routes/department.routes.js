import express from "express";

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

router.post("/", createDepartment);

router.get("/", getDepartments);

router.get("/search", searchDepartments);

router.get("/:id", getDepartmentById);

router.put("/:id", updateDepartment);

router.put("/:id/toggle-status", toggleDepartmentStatus);

router.delete("/:id", deleteDepartment);

export default router;