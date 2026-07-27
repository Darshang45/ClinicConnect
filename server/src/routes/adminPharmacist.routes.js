import express from "express";

import {
  createPharmacist,
  getPharmacists,
  getPharmacistById,
  updatePharmacist,
  deletePharmacist,
} from "../controllers/adminPharmacist.controller.js";

const router = express.Router();

router.post("/", createPharmacist);

router.get("/", getPharmacists);

router.get("/:id", getPharmacistById);

router.put("/:id", updatePharmacist);

router.delete("/:id", deletePharmacist);

export default router;