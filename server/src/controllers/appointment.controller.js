import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import DoctorAvailability from "../models/DoctorAvailability.js";

import { validateAppointment } from "../validators/appointment.validator.js";

import { calculateAppointmentTime } from "../services/appointment.service.js";

export const bookAppointment = async (req, res) => {
  try {

    // ==============================
    // Step 1: Get Request Data
    // ==============================

    const {
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      appointmentTime,
      consultationType,
      reason,
      symptoms,
    } = req.body;

    // ==============================
    // Step 2: Validate Request
    // ==============================

    const validation = validateAppointment(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // ==============================
    // Step 3: Check Patient
    // ==============================

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // ==============================
    // Step 4: Check Doctor
    // ==============================

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ==============================
    // Step 5: Check Department
    // ==============================

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // ==============================
    // Step 6: Calculate Start & End Time
    // ==============================

    const {
      appointmentStart,
      appointmentEnd,
    } = calculateAppointmentTime(
      appointmentDate,
      appointmentTime
    );

    // ==============================
    // Step 7: Prevent Past Booking
    // ==============================

    if (appointmentStart < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book an appointment in the past.",
      });
    }

    // ==============================
    // Step 8: Check Doctor Leave
    // ==============================

    const leave = await DoctorAvailability.findOne({
      doctor: doctorId,
      date: new Date(appointmentDate),
      isAvailable: false,
    });

    if (leave) {
      return res.status(400).json({
        success: false,
        message: "Doctor is unavailable on this date.",
      });
    }

    // ==============================
    // Step 9: Prevent Double Booking
    // ==============================

    const existingAppointment =
      await Appointment.findOne({

        doctor: doctorId,

        status: {
          $ne: "Cancelled",
        },

        appointmentStart: {
          $lt: appointmentEnd,
        },

        appointmentEnd: {
          $gt: appointmentStart,
        },

      });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is already booked.",
      });
    }

    // ==============================
    // Step 10: Create Appointment
    // ==============================

    const appointment =
      await Appointment.create({

        patient: patientId,

        doctor: doctorId,

        department: departmentId,

        appointmentStart,

        appointmentEnd,

        consultationType,

        reason,

        symptoms,

      });

    // ==============================
    // Step 11: Populate Details
    // ==============================

    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate("patient")
        .populate("doctor")
        .populate("department");

    // ==============================
    // Step 12: Return Response
    // ==============================

    return res.status(201).json({

      success: true,

      message: "Appointment booked successfully.",

      appointment: populatedAppointment,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};