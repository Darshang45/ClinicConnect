import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  createPharmacyOrder,
  getAllPharmacyOrders,
  getPharmacyOrderById,
  getOrdersByPatient,
  markOrderAsPaid,
  dispenseMedicines,
  deletePharmacyOrder,
  getPharmacyDashboard,
  getPendingOrders,
  getDispensedOrders,
  getRecentOrders,
} from "../controllers/pharmacy.controller.js";

// import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.use(protect);

// Create Pharmacy Order
router.post("/", createPharmacyOrder);

// Get All Pharmacy Orders
router.get(
  "/",
  authenticate,
  authorize("pharmacist", "admin"),
  getAllPharmacyOrders,
);

router.get(
  "/dashboard",
  authenticate,
  authorize("pharmacist"),
  getPharmacyDashboard
);

router.get(
  "/dashboard/pending",
  authenticate,
  authorize("pharmacist"),
  getPendingOrders
);

router.get(
  "/dashboard/dispensed",
  authenticate,
  authorize("pharmacist"),
  getDispensedOrders
);

router.get(
  "/dashboard/recent",
  authenticate,
  authorize("pharmacist"),
  getRecentOrders
);

// Get Orders By Patient
router.get(
  "/patient/:patientId",
  authenticate,
  authorize("pharmacist", "admin"),
  getOrdersByPatient,
);

// Get Pharmacy Order By ID
router.get(
  "/:id",
  authenticate,
  authorize("pharmacist", "admin"),
  getPharmacyOrderById,
);

// Mark Payment as Paid
router.put("/:id/pay", markOrderAsPaid);

// Dispense Medicines
router.put(
  "/:id/dispense",
  authenticate,
  authorize("pharmacist"),
  dispenseMedicines,
);

// Delete Pharmacy Order
router.delete("/:id", deletePharmacyOrder);

export default router;
