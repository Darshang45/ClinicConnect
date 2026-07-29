import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createAnnouncement);

router.get("/", getAllAnnouncements);

router.get("/:id", getAnnouncementById);

router.put("/:id", updateAnnouncement);

router.delete("/:id", deleteAnnouncement);

export default router;