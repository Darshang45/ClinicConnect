import Prescription from "../models/Prescription.js";
import PrescriptionItem from "../models/PrescriptionItem.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Medicine from "../models/Medicine.js";

import { validatePrescription } from "../validators/prescription.validator.js";

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

    // Only completed appointments can have prescriptions
    if (appointmentExists.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Prescription can only be created after consultation is completed.",
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
    const prescription = await Prescription.create({
      appointment,
      patient,
      doctor,
      diagnosis,
      notes,
      followUpDate,
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
    const prescriptions = await Prescription.find()
      .populate("appointment")
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    const response = [];

    for (const prescription of prescriptions) {
      const medicines = await PrescriptionItem.find({
        prescription: prescription._id,
      }).populate("medicine");

      response.push({
        ...prescription.toObject(),
        medicines,
      });
    }

    return res.status(200).json({
      success: true,
      count: response.length,
      prescriptions: response,
    });
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
    }).populate("medicine");

    return res.status(200).json({
      success: true,
      prescription,
      medicines,
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
    }).populate("medicine");

    return res.status(200).json({
      success: true,
      prescription,
      medicines,
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
    } = req.body;

    if (diagnosis) prescription.diagnosis = diagnosis;

    if (notes !== undefined) prescription.notes = notes;

    if (followUpDate) prescription.followUpDate = followUpDate;

    if (status) prescription.status = status;

    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully.",
      prescription,
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