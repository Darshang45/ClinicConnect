import express from "express";

import {
  createReceptionist,
  getReceptionists,
  getReceptionistById,
  updateReceptionist,
  deleteReceptionist,
} from "../controllers/adminReceptionist.controller.js";

const router = express.Router();

router.post("/", createReceptionist);

router.get("/", getReceptionists);

router.get("/:id", getReceptionistById);

router.put("/:id", updateReceptionist);

router.delete("/:id", deleteReceptionist);

export default router;