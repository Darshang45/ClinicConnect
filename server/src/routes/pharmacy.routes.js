import express from "express";

import {
  createPharmacyOrder,
  getAllPharmacyOrders,
  getPharmacyOrderById,
  getOrdersByPatient,
  markOrderAsPaid,
  dispenseMedicines,
  deletePharmacyOrder,
} from "../controllers/pharmacy.controller.js";

// import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.use(protect);

// Create Pharmacy Order
router.post("/", createPharmacyOrder);

// Get All Pharmacy Orders
router.get("/", getAllPharmacyOrders);

// Get Orders By Patient
router.get("/patient/:patientId", getOrdersByPatient);

// Get Pharmacy Order By ID
router.get("/:id", getPharmacyOrderById);

// Mark Payment as Paid
router.put("/:id/pay", markOrderAsPaid);

// Dispense Medicines
router.put("/:id/dispense", dispenseMedicines);

// Delete Pharmacy Order
router.delete("/:id", deletePharmacyOrder);

export default router;