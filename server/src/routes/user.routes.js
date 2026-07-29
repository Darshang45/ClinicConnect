import express from "express";

import {

    getMyProfile,

    updateProfile,

    changePassword

} from "../controllers/user.controller.js";

// import {

//     protect

// } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me",  getMyProfile);

router.put("/me", updateProfile);

router.put("/change-password", changePassword);

export default router;