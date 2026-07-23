import express from "express";

import {
  createAvailability,
  getAvailableSlots,
  getAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availability.controller.js";

const router = express.Router();

router.post("/", createAvailability);

router.get("/slots", getAvailableSlots);

router.get("/:doctorId", getAvailability);

router.put("/:doctorId", updateAvailability);

router.delete("/:doctorId", deleteAvailability);

export default router;