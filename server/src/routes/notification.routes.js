import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getNotifications);
router.get("/unread", getUnreadNotifications);
router.patch("/read-all", markAllAsRead);

router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
