import express from "express";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import {
  createDoctorByAdmin,
  getDoctorsByAdmin,
  getDoctorByIdByAdmin,
  updateDoctorByAdmin,
  deleteDoctorByAdmin,
} from "../controllers/adminDoctor.controller.js";
import uploadProfilePhoto from "../uploads/uploadProfilePhoto.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadProfilePhoto,
  createDoctorByAdmin,
);

router.get("/", authenticate, authorize("admin"), getDoctorsByAdmin);

router.get("/:id", authenticate, authorize("admin"), getDoctorByIdByAdmin);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadProfilePhoto,
  updateDoctorByAdmin,
);

router.delete("/:id", authenticate, authorize("admin"), deleteDoctorByAdmin);

export default router;
