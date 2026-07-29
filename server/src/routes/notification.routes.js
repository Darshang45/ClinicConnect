import express from "express";

import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getNotifications);

router.get("/:userId/unread", getUnreadNotifications);

router.patch("/:id/read", markAsRead);

router.patch("/:userId/read-all", markAllAsRead);

router.delete("/:id", deleteNotification);

export default router;
