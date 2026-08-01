import mongoose from "mongoose";

import PharmacyOrder from "../models/PharmacyOrder.js";
import PharmacyOrderItem from "../models/PharmacyOrderItem.js";

import Prescription from "../models/Prescription.js";
import PrescriptionItem from "../models/PrescriptionItem.js";
import Medicine from "../models/Medicine.js";

import { validatePharmacyOrder } from "../validators/pharmacy.validator.js";
import { logActivity } from "../utils/activityLogger.js";
import { createNotification } from "./notification.controller.js";
import { paginateQuery } from "../utils/paginate.js";

export const createPharmacyOrder = async (req, res) => {
  try {
    const validation = validatePharmacyOrder(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const { prescription } = req.body;

    if (!mongoose.Types.ObjectId.isValid(prescription)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription id.",
      });
    }

    const prescriptionExists = await Prescription.findById(prescription);

    if (!prescriptionExists) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    const existingOrder = await PharmacyOrder.findOne({ prescription });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "Pharmacy order already exists.",
      });
    }

    const prescriptionItems = await PrescriptionItem.find({
      prescription,
    }).populate("medicine");

    if (!prescriptionItems.length) {
      return res.status(400).json({
        success: false,
        message: "No medicines found in prescription.",
      });
    }

    let totalAmount = 0;

    const pharmacyOrder = await PharmacyOrder.create({
      prescription,
      patient: prescriptionExists.patient,
    });

    const pharmacyItems = [];

    for (const item of prescriptionItems) {
      const medicine = await Medicine.findById(item.medicine);

      const unitPrice = medicine.price;

      const totalPrice = unitPrice * item.quantity;

      totalAmount += totalPrice;

      pharmacyItems.push({
        pharmacyOrder: pharmacyOrder._id,
        medicine: medicine._id,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    await PharmacyOrderItem.insertMany(pharmacyItems);

    pharmacyOrder.totalAmount = totalAmount;

    await pharmacyOrder.save();

    return res.status(201).json({
      success: true,
      message: "Pharmacy order created successfully.",
      pharmacyOrder,
      medicines: pharmacyItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPharmacyOrders = async (req, res) => {
  try {
    const response = await paginateQuery({
      model: PharmacyOrder,
      query: PharmacyOrder.find()
        .populate("prescription")
        .populate("patient")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Pharmacy orders retrieved successfully.",
      legacy: { dataKey: "orders", totalKey: "count" },
    });

    const orderIds = response.data.map((order) => order._id);
    const orderItems = orderIds.length
      ? await PharmacyOrderItem.find({
          pharmacyOrder: { $in: orderIds },
        })
          .populate("medicine")
          .lean()
      : [];
    const medicinesByOrder = new Map();

    for (const item of orderItems) {
      const key = item.pharmacyOrder.toString();
      const medicines = medicinesByOrder.get(key) || [];
      medicines.push(item);
      medicinesByOrder.set(key, medicines);
    }

    response.data = response.data.map((order) => ({
      ...order,
      medicines: medicinesByOrder.get(order._id.toString()) || [],
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPharmacyOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pharmacy order id.",
      });
    }

    const order = await PharmacyOrder.findById(req.params.id)
      .populate("prescription")
      .populate("patient");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy order not found.",
      });
    }

    const medicines = await PharmacyOrderItem.find({
      pharmacyOrder: order._id,
    }).populate("medicine");

    return res.status(200).json({
      success: true,
      order,
      medicines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersByPatient = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id.",
      });
    }

    const filter = { patient: req.params.patientId };
    const response = await paginateQuery({
      model: PharmacyOrder,
      filter,
      query: PharmacyOrder.find(filter)
        .populate("prescription")
        .populate("patient")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Patient pharmacy orders retrieved successfully.",
      legacy: { dataKey: "orders", totalKey: "count" },
    });

    const orderIds = response.data.map((order) => order._id);
    const orderItems = orderIds.length
      ? await PharmacyOrderItem.find({
          pharmacyOrder: { $in: orderIds },
        })
          .populate("medicine")
          .lean()
      : [];
    const medicinesByOrder = new Map();

    for (const item of orderItems) {
      const key = item.pharmacyOrder.toString();
      const medicines = medicinesByOrder.get(key) || [];
      medicines.push(item);
      medicinesByOrder.set(key, medicines);
    }

    response.data = response.data.map((order) => ({
      ...order,
      medicines: medicinesByOrder.get(order._id.toString()) || [],
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await PharmacyOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy order not found.",
      });
    }

    order.paymentStatus = "Paid";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment marked as paid.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const dispenseMedicines = async (req, res) => {
  try {
    const order = await PharmacyOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy order not found.",
      });
    }

    order.dispensingStatus = "Dispensed";
    order.dispensedAt = new Date();

    await order.save();

    // ==============================
    //      Create Notifications
    // ==============================

    const populatedOrder = await PharmacyOrder.findById(order._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "prescription",
        populate: {
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName",
          },
        },
      });

    await createNotification({
      title: "Prescription Dispensed",
      message: `Your prescribed medicines for Dr. ${populatedOrder.prescription.doctor.user.fullName}'s prescription have been dispensed successfully.`,
      sender: req.user._id, // Pharmacist User ID
      receiver: populatedOrder.patient.user._id,
    });

    await createNotification({
      title: "Prescription Dispensed",
      message: `Prescription for ${populatedOrder.patient.user.fullName} has been dispensed by ${req.user.fullName}.`,
      sender: req.user._id,
      receiverRole: "pharmacist",
    });

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "DISPENSE_MEDICINE",
      module: "Pharmacy",
      description: `Dispensed medicines for ${patient.fullName}.`,
      ipAddress: req.ip,
    });

    //response
    return res.status(200).json({
      success: true,
      message: "Medicines dispensed successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePharmacyOrder = async (req, res) => {
  try {
    const order = await PharmacyOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy order not found.",
      });
    }

    await PharmacyOrderItem.deleteMany({
      pharmacyOrder: order._id,
    });

    await PharmacyOrder.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Pharmacy order deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPharmacyDashboard = async (req, res) => {
  try {
    const totalOrders = await PharmacyOrder.countDocuments();

    const pendingOrders = await PharmacyOrder.countDocuments({
      dispensingStatus: "Pending",
    });

    const dispensedOrders = await PharmacyOrder.countDocuments({
      dispensingStatus: "Dispensed",
    });

    const unpaidOrders = await PharmacyOrder.countDocuments({
      paymentStatus: "Pending",
    });

    const paidOrders = await PharmacyOrder.countDocuments({
      paymentStatus: "Paid",
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalOrders,
        pendingOrders,
        dispensedOrders,
        paidOrders,
        unpaidOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const filter = {
      dispensingStatus: "Pending",
    };
    const response = await paginateQuery({
      model: PharmacyOrder,
      filter,
      query: PharmacyOrder.find(filter)
        .populate("patient", "patientId fullName phone")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Pending pharmacy orders retrieved successfully.",
      legacy: { dataKey: "orders", totalKey: "total" },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDispensedOrders = async (req, res) => {
  try {
    const filter = {
      dispensingStatus: "Dispensed",
    };
    const response = await paginateQuery({
      model: PharmacyOrder,
      filter,
      query: PharmacyOrder.find(filter)
        .populate("patient", "patientId fullName phone")
        .sort({ dispensedAt: -1 }),
      pagination: req.query,
      message: "Dispensed pharmacy orders retrieved successfully.",
      legacy: { dataKey: "orders", totalKey: "total" },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await PharmacyOrder.find()
      .populate("patient", "patientId fullName")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
