import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/auth.middleware.js";

import {
  getActivityLogs,
  getActivityLogById,
} from "../controllers/activityLog.controller.js";

const router = express.Router();

// Only Admin can access Activity Logs
router.use(authenticate);
router.use(authorize("admin"));

router.get("/", getActivityLogs);

router.get("/:id", getActivityLogById);

export default router;