import express from "express";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
  getDoctorsByDepartment,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/", createDoctor);

router.get("/", getDoctors);

router.get("/search", searchDoctors);

router.get("/department/:departmentId", getDoctorsByDepartment);

router.get("/:id", getDoctorById);

router.put("/:id", updateDoctor);

router.delete("/:id", deleteDoctor);

export default router;