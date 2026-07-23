import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import DoctorAvailability from "../models/DoctorAvailability.js";

import { validateAppointment } from "../validators/appointment.validator.js";
import { calculateAppointmentTime } from "../services/appointment.service.js";
import { generateSlots } from "../utils/slotGenerator.js";
import { getDayName } from "../utils/dateHelper.js";

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

    const { appointmentStart, appointmentEnd } = calculateAppointmentTime(
      appointmentDate,
      appointmentTime,
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

    // const leave = await DoctorAvailability.findOne({
    //   doctor: doctorId,
    //   date: new Date(appointmentDate),
    //   isAvailable: false,
    // });

    // if (leave) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Doctor is unavailable on this date.",
    //   });
    // }

    // ==============================
    // Step 8: Get Doctor Availability
    // ==============================

    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Doctor availability not found.",
      });
    }

    // ==============================
    // Step 9: Check Day Schedule
    // ==============================

    const day = getDayName(appointmentDate);

    const schedule = availability.schedule.find((item) => item.day === day);

    if (!schedule || !schedule.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Doctor is unavailable on this day.",
      });
    }

    // ==============================
    // Step 10: Generate Slots
    // ==============================

    const allSlots = generateSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.breakStart,
      schedule.breakEnd,
      availability.consultationDuration,
    );

    // ==============================
    // Step 11: Get Booked Slots
    // ==============================

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["Scheduled", "Checked-In", "In Consultation"],
      },
    });

    const bookedSlots = bookedAppointments.map((appointment) => {
      const date = new Date(appointment.appointmentStart);

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
    });

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot.start),
    );

    const selectedSlot = availableSlots.find(
      (slot) => slot.start === appointmentTime,
    );

    if (!selectedSlot) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is no longer available.",
      });
    }

    // ==============================
    // Step 13: Generate Token Number
    // ==============================

    const lastAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ tokenNumber: -1 });

    const tokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;
    const appointment = await Appointment.create({
      patient: patientId,

      doctor: doctorId,

      department: departmentId,

      appointmentStart,

      appointmentEnd,

      consultationType,

      reason,

      symptoms,

      tokenNumber,
    });

    // ==============================
    // Step 11: Populate Details
    // ==============================

    const populatedAppointment = await Appointment.findById(appointment._id)
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
