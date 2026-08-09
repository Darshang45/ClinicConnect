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

    const { prescription, items } = req.body;

    // ==========================================
    // Validate Prescription ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(prescription)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription id.",
      });
    }

    // ==========================================
    // Find Prescription
    // ==========================================

    const prescriptionExists =
      await Prescription.findById(prescription);

    if (!prescriptionExists) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    // ==========================================
    // Check Existing Pharmacy Order
    // ==========================================

    const existingOrder =
      await PharmacyOrder.findOne({
        prescription,
      });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "Pharmacy order already exists.",
      });
    }

    // ==========================================
    // Get Original Prescription Items
    // ==========================================

    const prescriptionItems =
      await PrescriptionItem.find({
        prescription,
      });

    if (!prescriptionItems.length) {
      return res.status(400).json({
        success: false,
        message: "No medicines found in prescription.",
      });
    }

    // ==========================================
    // Use Prescription Items if no custom items
    // ==========================================

    const orderItems =
      Array.isArray(items) && items.length
        ? items
        : prescriptionItems.map((item) => ({
            medicine: item.medicine,
            quantity: item.quantity,
          }));

    if (!orderItems.length) {
      return res.status(400).json({
        success: false,
        message: "No medicines selected for pharmacy order.",
      });
    }

    // ==========================================
    // Validate Selected Medicines
    // ==========================================

    const prescriptionMedicineIds =
      new Set(
        prescriptionItems.map((item) =>
          item.medicine.toString()
        )
      );

    for (const item of orderItems) {
      if (
        !mongoose.Types.ObjectId.isValid(
          item.medicine
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid medicine id.",
        });
      }

      if (
        !prescriptionMedicineIds.has(
          item.medicine.toString()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Medicine is not part of the prescription.",
        });
      }

      if (
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Medicine quantity must be at least 1.",
        });
      }
    }

    // ==========================================
    // Create Pharmacy Order
    // ==========================================

    const pharmacyOrder =
      await PharmacyOrder.create({
        prescription,
        patient: prescriptionExists.patient,
      });

    let totalAmount = 0;

    const pharmacyItems = [];

    // ==========================================
    // Create Pharmacy Order Items
    // ==========================================

    for (const item of orderItems) {
      const medicine =
        await Medicine.findById(item.medicine);

      if (!medicine || !medicine.isActive) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found or inactive.",
        });
      }

      const quantity = Number(item.quantity);

      const unitPrice = medicine.price;

      const totalPrice =
        unitPrice * quantity;

      totalAmount += totalPrice;

      pharmacyItems.push({
        pharmacyOrder:
          pharmacyOrder._id,

        medicine:
          medicine._id,

        quantity,

        unitPrice,

        totalPrice,
      });
    }

    // ==========================================
    // Save Pharmacy Order Items
    // ==========================================

    await PharmacyOrderItem.insertMany(
      pharmacyItems
    );

    // ==========================================
    // Update Total
    // ==========================================

    pharmacyOrder.totalAmount =
      totalAmount;

    await pharmacyOrder.save();

    return res.status(201).json({
      success: true,
      message:
        "Pharmacy order created successfully.",

      pharmacyOrder,

      medicines:
        pharmacyItems,
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

export const getPharmacyOrderByPrescription = async (
  req,
  res
) => {
  try {
    const { prescriptionId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        prescriptionId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription id.",
      });
    }

    const order = await PharmacyOrder.findOne({
      prescription: prescriptionId,
    })
      .populate("prescription")
      .populate(
        "patient",
        "patientId fullName phone"
      )
      .lean();

    if (!order) {
      return res.status(200).json({
        success: true,
        order: null,
      });
    }

    const medicines =
      await PharmacyOrderItem.find({
        pharmacyOrder: order._id,
      })
        .populate(
          "medicine",
          "name genericName brand category strength price unit"
        )
        .lean();

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        medicines,
      },
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


// ==========================================
// Get Prescriptions for Pharmacy
// ==========================================

export const getPharmacyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      status: {
        $in: ["Issued", "Dispensed"],
      },
    })
      .populate(
        "patient",
        "patientId fullName email phone gender dateOfBirth bloodGroup address allergies chronicDiseases emergencyContact"
      )
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "fullName email phone",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      })
      .populate({
        path: "appointment",
        select:
          "appointmentStart appointmentEnd consultationType reason symptoms status consultationStartTime consultationEndTime",
      })
      .sort({
        updatedAt: -1,
      })
      .lean();

    const prescriptionIds = prescriptions.map(
      (prescription) => prescription._id
    );

    // ==========================================
    // Prescription Medicines
    // ==========================================

    const prescriptionItems = prescriptionIds.length
      ? await PrescriptionItem.find({
          prescription: {
            $in: prescriptionIds,
          },
        })
          .populate(
            "medicine",
            "name genericName brand category strength manufacturer unit price"
          )
          .lean()
      : [];

    const medicinesByPrescription = new Map();

    prescriptionItems.forEach((item) => {
      const key = item.prescription.toString();

      const medicines =
        medicinesByPrescription.get(key) || [];

      medicines.push(item);

      medicinesByPrescription.set(
        key,
        medicines
      );
    });

    // ==========================================
    // Previous Prescriptions
    // ==========================================

    const patientIds = [
      ...new Set(
        prescriptions
          .filter((item) => item.patient?._id)
          .map((item) =>
            item.patient._id.toString()
          )
      ),
    ];

    const previousPrescriptions =
      patientIds.length
        ? await Prescription.find({
            patient: {
              $in: patientIds,
            },
          })
            .select(
              "_id patient diagnosis status createdAt updatedAt"
            )
            .sort({
              createdAt: -1,
            })
            .lean()
        : [];

    const previousByPatient = new Map();

    previousPrescriptions.forEach(
      (prescription) => {
        const key =
          prescription.patient.toString();

        const list =
          previousByPatient.get(key) || [];

        list.push(prescription);

        previousByPatient.set(key, list);
      }
    );

    // ==========================================
    // Final Response
    // ==========================================

    const data = prescriptions.map(
      (prescription) => {
        const patientKey =
          prescription.patient?._id?.toString();

        const patientHistory =
          previousByPatient.get(
            patientKey
          ) || [];

        return {
          ...prescription,

          medicines:
            medicinesByPrescription.get(
              prescription._id.toString()
            ) || [],

          previousPrescriptions:
            patientHistory
              .filter(
                (item) =>
                  item._id.toString() !==
                  prescription._id.toString()
              )
              .slice(0, 10),
        };
      }
    );

    return res.status(200).json({
      success: true,
      total: data.length,
      prescriptions: data,
    });
  } catch (error) {
    console.error(
      "Get Pharmacy Prescriptions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};