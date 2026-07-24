import mongoose from "mongoose";

import PharmacyOrder from "../models/PharmacyOrder.js";
import PharmacyOrderItem from "../models/PharmacyOrderItem.js";

import Prescription from "../models/Prescription.js";
import PrescriptionItem from "../models/PrescriptionItem.js";
import Medicine from "../models/Medicine.js";

import { validatePharmacyOrder } from "../validators/pharmacy.validator.js";

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
    const orders = await PharmacyOrder.find()
      .populate("prescription")
      .populate("patient")
      .sort({ createdAt: -1 });

    const result = [];

    for (const order of orders) {
      const medicines = await PharmacyOrderItem.find({
        pharmacyOrder: order._id,
      }).populate("medicine");

      result.push({
        ...order.toObject(),
        medicines,
      });
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      orders: result,
    });
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

    const orders = await PharmacyOrder.find({
      patient: req.params.patientId,
    })
      .populate("prescription")
      .populate("patient")
      .sort({ createdAt: -1 });

    const result = [];

    for (const order of orders) {

      const medicines = await PharmacyOrderItem.find({
        pharmacyOrder: order._id,
      }).populate("medicine");

      result.push({
        ...order.toObject(),
        medicines,
      });

    }

    return res.status(200).json({
      success: true,
      count: result.length,
      orders: result,
    });

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