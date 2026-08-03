import express from "express";
import {
  getPublicDepartments,
  getPublicDoctorsByDepartment,
} from "../controllers/public.controller.js";

const router = express.Router();

router.get("/departments", getPublicDepartments);
router.get("/doctors/:departmentId", getPublicDoctorsByDepartment);

export default router;
