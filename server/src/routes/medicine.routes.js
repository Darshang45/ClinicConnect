import express from "express";

import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  getMedicinesByCategory,
} from "../controllers/medicine.controller.js";

const router = express.Router();

router.post("/", createMedicine);

router.get("/", getMedicines);

router.get("/search", searchMedicines);

router.get("/category/:category", getMedicinesByCategory);

router.get("/:id", getMedicineById);

router.put("/:id", updateMedicine);

router.delete("/:id", deleteMedicine);

export default router;