import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import DoctorAvailability from "../models/DoctorAvailability.js";

import { validateAppointment } from "../validators/appointment.validator.js";
import { calculateAppointmentTime } from "../services/appointment.service.js";
import { generateSlots } from "../utils/slotGenerator.js";
import { getDayName } from "../utils/dateHelper.js";

// ==========================================
// Get Today's Appointments
// ==========================================

export const getTodayAppointments = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization consultationFee",
        populate: {
          path: "user",
          select: "fullName email",
        },
      })
      .populate({
        path: "department",
        select: "name",
      })
      .sort({
        tokenNumber: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// Check-In Patient
// ==========================================

export const checkInPatient = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be checked in.",
      });
    }

    if (appointment.status === "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Patient is already checked in.",
      });
    }

    if (appointment.status !== "Scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot check in appointment with status '${appointment.status}'.`,
      });
    }

    appointment.status = "Checked-In";
    appointment.checkInTime = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      message: "Patient checked in successfully.",
      appointment: {
        id: updatedAppointment._id,

        patient: updatedAppointment.patient,

        doctor: {
          id: updatedAppointment.doctor._id,
          fullName: updatedAppointment.doctor.user.fullName,
          specialization: updatedAppointment.doctor.specialization,
        },

        department: updatedAppointment.department,

        appointmentStart: updatedAppointment.appointmentStart,

        status: updatedAppointment.status,

        tokenNumber: updatedAppointment.tokenNumber,

        checkInTime: updatedAppointment.checkInTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================================
// Start Consultation
// ==========================================

export const startConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot start consultation.",
      });
    }

    if (appointment.status === "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Consultation has already started.",
      });
    }

    if (appointment.status !== "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Patient must be checked in before starting consultation.",
      });
    }

    appointment.status = "In Consultation";
    appointment.consultationStartTime = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      message: "Consultation started successfully.",
      appointment: {
        id: updatedAppointment._id,
        patient: updatedAppointment.patient,
        doctor: {
          id: updatedAppointment.doctor._id,
          fullName: updatedAppointment.doctor.user.fullName,
          specialization: updatedAppointment.doctor.specialization,
        },
        department: updatedAppointment.department,
        appointmentStart: updatedAppointment.appointmentStart,
        tokenNumber: updatedAppointment.tokenNumber,
        status: updatedAppointment.status,
        consultationStartTime:
          updatedAppointment.consultationStartTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================================
// Complete Appointment
// ==========================================

export const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be completed.",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already completed.",
      });
    }

    if (appointment.status !== "In Consultation") {
      return res.status(400).json({
        success: false,
        message:
          "Appointment must be in consultation before it can be completed.",
      });
    }

    appointment.status = "Completed";
    appointment.consultationEndTime = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
      appointment: {
        id: updatedAppointment._id,
        patient: updatedAppointment.patient,
        doctor: {
          id: updatedAppointment.doctor._id,
          fullName: updatedAppointment.doctor.user.fullName,
          specialization: updatedAppointment.doctor.specialization,
        },
        department: updatedAppointment.department,
        appointmentStart: updatedAppointment.appointmentStart,
        tokenNumber: updatedAppointment.tokenNumber,
        status: updatedAppointment.status,
        consultationStartTime:
          updatedAppointment.consultationStartTime,
        consultationEndTime:
          updatedAppointment.consultationEndTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================================
// Cancel Appointment
// ==========================================

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { cancelledBy, cancellationReason } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an appointment that is in consultation.",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointments cannot be cancelled.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled.",
      });
    }

    appointment.status = "Cancelled";
    appointment.cancelledBy = cancelledBy;
    appointment.cancellationReason = cancellationReason;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment: {
        id: appointment._id,
        status: appointment.status,
        cancelledBy: appointment.cancelledBy,
        cancellationReason: appointment.cancellationReason,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const createWalkInAppointment = async (req, res) => {
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

      consultationDuration: availability.consultationDuration,

      consultationType,

      reason,

      symptoms,

      tokenNumber,

      bookedBy: "Receptionist",

      status: "Checked-In",

      checkInTime: new Date(),
    });

    // ==============================
    // Step 11: Populate Details
    // ==============================

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    // ==============================
    // Step 12: Return Response
    // ==============================

    return res.status(201).json({
      success: true,

      message: "Walk-in appointment created successfully.",

      appointment: {
        id: populatedAppointment._id,

        patient: populatedAppointment.patient,

        doctor: {
          id: populatedAppointment.doctor._id,
          fullName: populatedAppointment.doctor.user.fullName,
          specialization: populatedAppointment.doctor.specialization,
        },

        department: populatedAppointment.department,

        appointmentStart: populatedAppointment.appointmentStart,

        appointmentEnd: populatedAppointment.appointmentEnd,

        consultationDuration: populatedAppointment.consultationDuration,

        consultationType: populatedAppointment.consultationType,

        tokenNumber: populatedAppointment.tokenNumber,

        status: populatedAppointment.status,

        bookedBy: populatedAppointment.bookedBy,

        checkInTime: populatedAppointment.checkInTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};  