import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

import {
  createPharmacist,
  getPharmacists,
  getPharmacistById,
  updatePharmacist,
  deletePharmacist,
} from "../controllers/adminPharmacist.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createPharmacist);

router.get("/", authenticate, authorize("admin"), getPharmacists);

router.get("/:id", authenticate, authorize("admin"), getPharmacistById);

router.put("/:id", authenticate, authorize("admin"), updatePharmacist);

router.delete("/:id", authenticate, authorize("admin"), deletePharmacist);

export default router;
