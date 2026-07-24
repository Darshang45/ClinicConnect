import express from "express";

import {
  createMedicalReport,
  getAllMedicalReports,
  getMedicalReportById,
  getReportsByPatient,
  getReportByAppointment,
  updateMedicalReport,
  deleteMedicalReport,
} from "../controllers/medicalReport.controller.js";

import uploadReport from "../uploads/uploadReport.js";

const router = express.Router();

router.post(
  "/",
  uploadReport.single("reportFile"),
  createMedicalReport
);

router.get("/", getAllMedicalReports);

router.get(
  "/patient/:patientId",
  getReportsByPatient
);

router.get(
  "/appointment/:appointmentId",
  getReportByAppointment
);

router.get("/:id", getMedicalReportById);

router.put(
  "/:id",
  uploadReport.single("reportFile"),
  updateMedicalReport
);

router.delete("/:id", deleteMedicalReport);

export default router;