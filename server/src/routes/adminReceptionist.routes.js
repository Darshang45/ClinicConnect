import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

import {
  createReceptionist,
  getReceptionists,
  getReceptionistById,
  updateReceptionist,
  deleteReceptionist,
} from "../controllers/adminReceptionist.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createReceptionist);

router.get("/", authenticate, authorize("admin"), getReceptionists);

router.get("/:id", authenticate, authorize("admin"), getReceptionistById);

router.put("/:id", authenticate, authorize("admin"), updateReceptionist);

router.delete("/:id", authenticate, authorize("admin"), deleteReceptionist);

export default router;