import express from "express";

import {

    getMyProfile,

    updateProfile,

    changePassword

} from "../controllers/user.controller.js";

import {

    protect

} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateProfile);

router.put("/change-password", protect, changePassword);

export default router;