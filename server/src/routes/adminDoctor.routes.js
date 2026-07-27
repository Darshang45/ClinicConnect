import express from "express";

import {
  createDoctorByAdmin,
  getDoctorsByAdmin,
  getDoctorByIdByAdmin,
  updateDoctorByAdmin,
  deleteDoctorByAdmin,
} from "../controllers/adminDoctor.controller.js";

const router = express.Router();

router.post("/", createDoctorByAdmin);

router.get("/", getDoctorsByAdmin);

router.get("/:id", getDoctorByIdByAdmin);

router.put("/:id", updateDoctorByAdmin);

router.delete("/:id", deleteDoctorByAdmin);

export default router;