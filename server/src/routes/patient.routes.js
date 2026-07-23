import express from "express";

import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientByPhone,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);

router.get("/", getPatients);

router.get("/search", searchPatients);

router.get("/phone/:phone", getPatientByPhone);

router.get("/:id", getPatientById);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;
