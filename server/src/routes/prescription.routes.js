import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionByAppointment,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("doctor"), createPrescription);

router.get("/", authenticate, authorize("doctor"), getAllPrescriptions);

router.get("/appointment/:appointmentId", getPrescriptionByAppointment);

router.get(
  "/:id",
  authenticate,
  authorize("doctor", "patient", "pharmacist", "admin"),
  getPrescriptionById,
);

router.put("/:id", authenticate, authorize("doctor"), updatePrescription);

router.delete("/:id", authenticate, authorize("admin"), deletePrescription);

export default router;
