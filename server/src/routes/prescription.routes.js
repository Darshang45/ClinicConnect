import express from "express";

import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionByAppointment,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller.js";

const router = express.Router();

router.post("/", createPrescription);

router.get("/", getAllPrescriptions);

router.get("/appointment/:appointmentId", getPrescriptionByAppointment);

router.get("/:id", getPrescriptionById);

router.put("/:id", updatePrescription);

router.delete("/:id", deletePrescription);

export default router;