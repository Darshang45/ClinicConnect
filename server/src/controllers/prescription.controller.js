import Prescription from "../models/Prescription.js";
import PrescriptionItem from "../models/PrescriptionItem.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Medicine from "../models/Medicine.js";

import { validatePrescription } from "../validators/prescription.validator.js";

import { createNotification } from "./notification.controller.js";
import { logActivity } from "../utils/activityLogger.js";
import { paginateQuery } from "../utils/paginate.js";

export const createPrescription = async (req, res) => {
  try {
    const validation = validatePrescription(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      appointment,
      patient,
      doctor,
      diagnosis,
      notes,
      followUpDate,
      medicines,
    } = req.body;

    // Check Appointment
    const appointmentExists = await Appointment.findById(appointment);

    if (!appointmentExists) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (!appointmentExists.doctor.equals(doctor)) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to create a prescription for this appointment.",
      });
    }

    // Only completed appointments can have prescriptions
    // Prescription can be created while consultation is in progress
    // or after it has been completed.
    if (!["In Consultation", "Completed"].includes(appointmentExists.status)) {
      return res.status(400).json({
        success: false,
        message:
          "Prescription can only be created during or after consultation.",
      });
    }

    if (["Cancelled", "No Show"].includes(appointmentExists.status)) {
      return res.status(400).json({
        success: false,
        message: "Prescription cannot be created for cancelled appointments.",
      });
    }

    // Prevent duplicate prescription
    const existingPrescription = await Prescription.findOne({
      appointment,
    });

    if (existingPrescription) {
      return res.status(409).json({
        success: false,
        message: "Prescription already exists for this appointment.",
      });
    }

    // Check Patient
    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Check Doctor
    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Create Prescription
    // Create Prescription
    const prescription = await Prescription.create({
      appointment,
      patient,
      doctor,
      diagnosis,
      notes,
      followUpDate,
    });

    // Link prescription to appointment
    appointmentExists.prescription = prescription._id;

    // Automatically complete consultation if not already completed
    if (appointmentExists.status !== "Completed") {
      appointmentExists.status = "Completed";

      if (!appointmentExists.consultationEndTime) {
        appointmentExists.consultationEndTime = new Date();
      }
    }

    await appointmentExists.save();

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "CREATE_PRESCRIPTION",
      module: "Prescription",
      description: `Prescription created for patient ${patientExists.fullName}.`,
      ipAddress: req.ip,
    });

    // Save Medicines
    const prescriptionItems = [];

    for (const item of medicines) {
      const medicineExists = await Medicine.findById(item.medicine);

      if (!medicineExists) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found: ${item.medicine}`,
        });
      }

      const prescriptionItem = await PrescriptionItem.create({
        prescription: prescription._id,
        medicine: item.medicine,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions,
      });

      prescriptionItems.push(prescriptionItem);
    }

    // populate the prescription
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      });

    // ==============================
    //      Create Notifications
    // ==============================
    // Notify Patient
    await createNotification({
      title: "Prescription Issued",
      message: `Your prescription has been issued successfully by Dr. ${populatedPrescription.doctor.user.fullName}.`,
      sender: populatedPrescription.doctor.user._id,
      receiver: populatedPrescription.patient.user._id,
    });

    // Notify Pharmacists
    await createNotification({
      title: "Prescription Issued",
      message: `A new prescription has been issued for ${populatedPrescription.patient.user.fullName} by Dr. ${populatedPrescription.doctor.user.fullName}.`,
      sender: populatedPrescription.doctor.user._id,
      receiverRole: "pharmacist",
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      prescription,
      medicines: prescriptionItems,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPrescriptions = async (req, res) => {
  try {
    const response = await paginateQuery({
      model: Prescription,
      query: Prescription.find()
        .populate("appointment")
        .populate("patient")
        .populate("doctor")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Prescriptions retrieved successfully.",
      legacy: { dataKey: "prescriptions", totalKey: "count" },
    });

    const prescriptionIds = response.data.map(
      (prescription) => prescription._id,
    );
    const prescriptionItems = prescriptionIds.length
      ? await PrescriptionItem.find({
          prescription: { $in: prescriptionIds },
        })
          .populate("medicine", "genericName")
          .lean()
      : [];
    const medicinesByPrescription = new Map();

    for (const item of prescriptionItems) {
      const key = item.prescription.toString();
      const medicines = medicinesByPrescription.get(key) || [];
      medicines.push(item);
      medicinesByPrescription.set(key, medicines);
    }

    response.data = response.data.map((prescription) => ({
      ...prescription,
      medicines: medicinesByPrescription.get(prescription._id.toString()) || [],
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("appointment")
      .populate("patient")
      .populate("doctor");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    const medicines = await PrescriptionItem.find({
    prescription: prescription._id,
}).populate("medicine", "genericName");

return res.status(200).json({
    success:true,
    prescription:{
        ...prescription.toObject(),
        medicines,
    }
});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPrescriptionByAppointment = async (req, res) => {
  try {
    
    const prescription = await Prescription.findOne({
      appointment: req.params.appointmentId,
    })
      .populate("appointment")
      .populate("patient")
      .populate("doctor");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    const medicines = await PrescriptionItem.find({
  prescription: prescription._id,
}).populate(
  "medicine",
  "name genericName strength category manufacturer"
);

return res.status(200).json({
    success:true,
    prescription:{
        ...prescription.toObject(),
        medicines,
    }
});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    const {
      diagnosis,
      notes,
      followUpDate,
      status,
      medicines,
    } = req.body;

    if (diagnosis) prescription.diagnosis = diagnosis;

    if (notes !== undefined) prescription.notes = notes;

    if (followUpDate) prescription.followUpDate = followUpDate;

    if (status) prescription.status = status;

    // ==========================================
    // Update Prescription Items
    // ==========================================

    if (Array.isArray(medicines)) {
      await PrescriptionItem.deleteMany({
        prescription: prescription._id,
      });

      for (const item of medicines) {
        await PrescriptionItem.create({
          prescription: prescription._id,
          medicine: item.medicine,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity,
          instructions: item.instructions || "",
        });
      }
    }

    // Update modified date
    prescription.updatedAt = new Date();

    await prescription.save();

    const appointment = await Appointment.findById(
      prescription.appointment
    );

    if (appointment && appointment.status !== "Completed") {
      appointment.status = "Completed";

      if (!appointment.consultationEndTime) {
        appointment.consultationEndTime = new Date();
      }

      await appointment.save();
    }

    // Get updated prescription items
    const updatedMedicines = await PrescriptionItem.find({
      prescription: prescription._id,
    }).populate(
      "medicine",
      "name genericName strength category manufacturer"
    );

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully.",
      prescription,
      medicines: updatedMedicines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    await PrescriptionItem.deleteMany({
      prescription: prescription._id,
    });

    await Prescription.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
