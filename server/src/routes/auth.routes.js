import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  login,
  getCurrentUser,
  changePassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", authenticate, getCurrentUser);

router.put("/change-password", authenticate, changePassword);

export default router;
