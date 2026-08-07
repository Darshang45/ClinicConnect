import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import DoctorAvailability from "../models/DoctorAvailability.js";
import { validateAppointment } from "../validators/appointment.validator.js";
import { calculateAppointmentTime } from "../services/appointment.service.js";
import { generateSlots } from "../utils/slotGenerator.js";
import { getDayName } from "../utils/dateHelper.js";
import { logActivity } from "../utils/activityLogger.js";
import { createNotification } from "./notification.controller.js";
import { paginateQuery } from "../utils/paginate.js";

const generatePatientId = async () => {
  const lastPatient = await Patient.findOne({
    patientId: /^PAT\d+$/,
  })
    .sort({ patientId: -1 })
    .select("patientId")
    .lean();

  if (!lastPatient) {
    return "PAT000001";
  }

  const lastNumber = parseInt(lastPatient.patientId.replace("PAT", ""), 10);

  const nextNumber = lastNumber + 1;

  return `PAT${String(nextNumber).padStart(6, "0")}`;
};
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

    const filter = {
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
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
        .sort({ tokenNumber: 1 }),
      pagination: req.query,
      message: "Today's appointments retrieved successfully.",
      legacy: { dataKey: "appointments", totalKey: "count" },
    });

    return res.status(200).json(response);
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

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "CHECK_IN_PATIENT",
      module: "Appointment",
      description: `Checked in appointment ${appointment._id}.`,
      ipAddress: req.ip,
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

    // Automatically update doctor status to In Consultation
    if (appointment.doctor) {
      await Doctor.findByIdAndUpdate(appointment.doctor, {
        status: "In Consultation",
      });
    }

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
        consultationStartTime: updatedAppointment.consultationStartTime,
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

    // Automatically update doctor status back to Available unless doctor is Off Duty
    if (appointment.doctor) {
      const doc = await Doctor.findById(appointment.doctor);
      if (doc && doc.status === "In Consultation") {
        doc.status = "Available";
        await doc.save();
      }
    }

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
        consultationStartTime: updatedAppointment.consultationStartTime,
        consultationEndTime: updatedAppointment.consultationEndTime,
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

    // ==========================================
    // Create Notifications
    // ==========================================

    await appointment.populate([
      {
        path: "patient",
        populate: {
          path: "user",
          select: "fullName",
        },
      },
      {
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      },
    ]);

    // Notify Patient
    await createNotification({
      title: "Appointment Cancelled",
      message: `Your appointment with Dr. ${appointment.doctor.user.fullName} has been cancelled.`,
      sender: req.user._id, // Receptionist User ID
      receiver: appointment.patient.user._id,
    });

    // Notify Receptionists
    await createNotification({
      title: "Appointment Cancelled",
      message: `An appointment has been cancelled for ${appointment.patient.fullName}.`,
      sender: req.user._id, // Receptionist User ID
      receiverRole: "receptionist",
    });

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "CANCEL_APPOINTMENT",
      module: "Appointment",
      description: `Cancelled appointment ${appointment._id}.`,
      ipAddress: req.ip,
    });

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
    const {
      // ==============================
      // Patient details
      // ==============================
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicDiseases,
      insurance,

      // ==============================
      // Appointment details
      // ==============================
      doctor,
      department,
      appointmentStart,
      appointmentEnd,
      reason,
      symptoms = [],
      consultationDuration,
    } = req.body;

    // ==========================================
    // 1. Required field validation
    // ==========================================

    if (
      !fullName ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !doctor ||
      !department ||
      !appointmentStart ||
      !appointmentEnd ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, phone, gender, date of birth, doctor, department, appointment time and reason are required.",
      });
    }

    // ==========================================
    // 2. Clean input
    // ==========================================

    const cleanName = String(fullName).trim();
    const cleanPhone = String(phone).trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : "";

    // ==========================================
    // 3. Validate phone
    // ==========================================

    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        field: "phone",
        message: "Phone number must contain exactly 10 digits.",
      });
    }

    // ==========================================
    // 4. Validate name
    // ==========================================

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        field: "fullName",
        message: "Full name must contain at least 2 characters.",
      });
    }

    // ==========================================
    // IMPORTANT:
    // DO NOT CHECK NAME UNIQUENESS.
    //
    // Multiple patients can have the same name.
    // ==========================================

    // ==========================================
    // 5. Validate email if provided
    // ==========================================

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Please enter a valid email address.",
      });
    }

    // ==========================================
    // 6. Validate date of birth
    // ==========================================

    const dob = new Date(dateOfBirth);

    if (Number.isNaN(dob.getTime())) {
      return res.status(400).json({
        success: false,
        field: "dateOfBirth",
        message: "Invalid date of birth.",
      });
    }

    if (dob > new Date()) {
      return res.status(400).json({
        success: false,
        field: "dateOfBirth",
        message: "Date of birth cannot be in the future.",
      });
    }

    // ==========================================
    // 7. Check doctor
    // ==========================================

    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists || !doctorExists.isActive) {
      return res.status(404).json({
        success: false,
        field: "doctor",
        message: "Doctor not found or inactive.",
      });
    }

    if (!doctorExists.isAvailable) {
      return res.status(400).json({
        success: false,
        field: "doctor",
        message: "Selected doctor is currently unavailable.",
      });
    }

    // ==========================================
    // 8. Check department
    // ==========================================

    const departmentExists = await Department.findById(department);

    if (!departmentExists || !departmentExists.isActive) {
      return res.status(404).json({
        success: false,
        field: "department",
        message: "Department not found or inactive.",
      });
    }

    // ==========================================
    // 9. Verify doctor belongs to department
    // ==========================================

    if (
      !doctorExists.department ||
      doctorExists.department.toString() !== departmentExists._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        field: "doctor",
        message: "Selected doctor does not belong to the selected department.",
      });
    }

    // ==========================================
    // 10. Validate appointment times
    // ==========================================

    const startTime = new Date(appointmentStart);
    const endTime = new Date(appointmentEnd);

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date or time.",
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: "Appointment end time must be after start time.",
      });
    }

    // ==========================================
    // 11. Determine consultation duration
    // ==========================================

    const actualConsultationDuration =
      Number(doctorExists.consultationDuration) ||
      Number(departmentExists.consultationDuration) ||
      15;

    const calculatedDuration =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    if (calculatedDuration !== actualConsultationDuration) {
      return res.status(400).json({
        success: false,
        message: `Appointment duration must be ${actualConsultationDuration} minutes.`,
      });
    }

    // ==========================================
    // 12. Check doctor appointment conflict
    // ==========================================

    const conflictingAppointment = await Appointment.findOne({
      doctor,
      status: {
        $nin: ["Cancelled", "No Show"],
      },
      appointmentStart: {
        $lt: endTime,
      },
      appointmentEnd: {
        $gt: startTime,
      },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        field: "appointmentStart",
        message: "Doctor already has an appointment during this time.",
      });
    }

    // ==========================================
    // 13. Resolve patient (Existing or New)
    // ==========================================

    let patient = null;
    let patientCreated = false;

    const existingRef = req.body.existingPatientId || req.body.patientId || req.body.patient;

    if (existingRef) {
      if (mongoose.Types.ObjectId.isValid(existingRef)) {
        patient = await Patient.findById(existingRef);
      }
      if (!patient) {
        patient = await Patient.findOne({ patientId: existingRef });
      }
      if (patient) {
        patientCreated = true;
      }
    }

    if (!patient) {
      // Check duplicate PHONE for new patient registration
      const phoneExists = await Patient.findOne({
        phone: cleanPhone,
      }).lean();

      if (phoneExists) {
        return res.status(409).json({
          success: false,
          field: "phone",
          message: "A patient with this phone number already exists.",
          patientId: phoneExists.patientId,
        });
      }

      // Check duplicate EMAIL for new patient registration
      if (cleanEmail) {
        const emailExists = await Patient.findOne({
          email: cleanEmail,
        }).lean();

        if (emailExists) {
          return res.status(409).json({
            success: false,
            field: "email",
            message: "A patient with this email address already exists.",
            patientId: emailExists.patientId,
          });
        }
      }

      const MAX_PATIENT_ID_ATTEMPTS = 5;

      for (let attempt = 1; attempt <= MAX_PATIENT_ID_ATTEMPTS; attempt++) {
        const generatedId = await generatePatientId();

        try {
          patient = await Patient.create({
            patientId: generatedId,
            fullName: cleanName,
            email: cleanEmail || undefined,
            phone: cleanPhone,
            gender,
            dateOfBirth: dob,
            bloodGroup,
            address,
            emergencyContact,
            allergies,
            chronicDiseases,
            insurance,
            isActive: true,
          });

          patientCreated = true;
          break;
        } catch (error) {
          if (error.code === 11000 && error.keyPattern?.patientId) {
            console.warn(
              `Patient ID collision on attempt ${attempt}. Retrying...`,
            );
            continue;
          }

          if (error.code === 11000 && error.keyPattern?.phone) {
            return res.status(409).json({
              success: false,
              field: "phone",
              message: "A patient with this phone number already exists.",
            });
          }

          if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(409).json({
              success: false,
              field: "email",
              message: "A patient with this email address already exists.",
            });
          }

          throw error;
        }
      }
    }

    // ==========================================
    // 16. Patient creation failed
    // ==========================================

    if (!patientCreated || !patient) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate a unique patient ID. Please try again.",
      });
    }

    // ==========================================
    // 17. Create appointment
    // ==========================================

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor,
      department,
      appointmentStart: startTime,
      appointmentEnd: endTime,
      consultationDuration: actualConsultationDuration,
      consultationType: "Offline",
      reason,
      symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
      status: "Scheduled",
      bookedBy: "Receptionist",
    });

    // ==========================================
    // 18. Populate appointment
    // ==========================================

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "patientId fullName phone email")
      .populate({
        path: "doctor",
        select: "user specialization qualification consultationFee",
        populate: {
          path: "user",
          select: "fullName email",
        },
      })
      .populate("department", "name code consultationDuration");

    // ==========================================
    // 19. Success response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Walk-in patient and appointment created successfully.",
      patient,
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Create walk-in appointment error:", error);

    // ==========================================
    // Final duplicate protection
    // ==========================================

    if (error.code === 11000) {
      if (error.keyPattern?.phone) {
        return res.status(409).json({
          success: false,
          field: "phone",
          message: "A patient with this phone number already exists.",
        });
      }

      if (error.keyPattern?.email) {
        return res.status(409).json({
          success: false,
          field: "email",
          message: "A patient with this email address already exists.",
        });
      }

      if (error.keyPattern?.patientId) {
        return res.status(409).json({
          success: false,
          field: "patientId",
          message:
            "Patient ID conflict occurred. Please try registering again.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReceptionistDashboard = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.countDocuments({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const checkedInPatients = await Appointment.countDocuments({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "Checked-In",
    });

    const pendingCheckIns = await Appointment.countDocuments({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "Booked",
    });

    const completedToday = await Appointment.countDocuments({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "Completed",
    });

    const walkInsToday = await Appointment.countDocuments({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bookedBy: "Receptionist",
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        todayAppointments,
        checkedInPatients,
        pendingCheckIns,
        completedToday,
        walkInsToday,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingCheckIns = async (req, res) => {
  try {
    const filter = {
      status: "Booked",
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
        .populate("patient", "patientId fullName phone")
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName",
          },
        })
        .sort({ appointmentStart: 1 }),
      pagination: req.query,
      message: "Pending check-ins retrieved successfully.",
      legacy: { dataKey: "appointments", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
      appointmentId: appointment._id,
      tokenNumber: appointment.tokenNumber,
      patientId: appointment.patient.patientId,
      patientName: appointment.patient.fullName,
      phone: appointment.patient.phone,
      doctorName: appointment.doctor.user.fullName,
      appointmentStart: appointment.appointmentStart,
      consultationType: appointment.consultationType,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodayWalkIns = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const filter = {
      bookedBy: "Receptionist",
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
        .populate("patient", "patientId fullName")
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName",
          },
        })
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Today's walk-in appointments retrieved successfully.",
      legacy: { dataKey: "walkIns", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
      appointmentId: appointment._id,
      tokenNumber: appointment.tokenNumber,
      patientName: appointment.patient.fullName,
      doctorName: appointment.doctor.user.fullName,
      status: appointment.status,
      appointmentStart: appointment.appointmentStart,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQueue = async (req, res) => {
  try {
    const filter = {
      status: {
        $in: ["Checked-In", "In Consultation"],
      },
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
        .populate("patient", "fullName")
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName",
          },
        })
        .sort({ tokenNumber: 1 }),
      pagination: req.query,
      message: "Queue retrieved successfully.",
      legacy: { dataKey: "queue", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
      tokenNumber: appointment.tokenNumber,
      patientName: appointment.patient.fullName,
      doctorName: appointment.doctor.user.fullName,
      status: appointment.status,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get departments for receptionist
export const getReceptionistDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      isActive: true,
    })
      .select("_id name code consultationDuration consultationFee")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    console.error("Get receptionist departments error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get available doctors for receptionist
export const getReceptionistDoctors = async (req, res) => {
  try {
    const filter = {
      isActive: true,
      isAvailable: true,
    };

    // If department is provided, only return doctors
    // belonging to that department.
    if (req.query.department) {
      filter.department = req.query.department;
    }

    const doctors = await Doctor.find(filter)
      .populate("user", "fullName")
      .populate("department", "name code")
      .select(
        "user department specialization qualification experience consultationFee",
      )
      .sort({ createdAt: -1 })
      .lean();

    const data = doctors.map((doctor) => ({
      doctorId: doctor._id,
      name: doctor.user?.fullName || "Unknown Doctor",
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      department: doctor.department
        ? {
            departmentId: doctor.department._id,
            name: doctor.department.name,
            code: doctor.department.code,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      doctors: data,
    });
  } catch (error) {
    console.error("Get receptionist doctors error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// Get Available Appointment Slots
// ==========================================

export const getReceptionistAvailableSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;

    // ==========================================
    // 1. Validate input
    // ==========================================

    if (!doctor || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor and appointment date are required.",
      });
    }

    // ==========================================
    // 2. Validate doctor
    // ==========================================

    const doctorExists = await Doctor.findById(doctor)
      .populate("department", "name consultationDuration")
      .lean();

    if (!doctorExists || !doctorExists.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or inactive.",
      });
    }

    if (!doctorExists.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Selected doctor is currently unavailable.",
      });
    }

    // ==========================================
    // 3. Validate date format
    // ==========================================

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date.",
      });
    }

    const selectedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date.",
      });
    }

    // ==========================================
    // 4. Allow only today + next 2 days
    // ==========================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maximumDate = new Date(today);
    maximumDate.setDate(maximumDate.getDate() + 2);
    maximumDate.setHours(23, 59, 59, 999);

    if (
      selectedDate < today ||
      selectedDate > maximumDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointments can only be booked for today or the next 2 days.",
      });
    }

    // ==========================================
    // 5. Determine consultation duration
    // ==========================================

    const consultationDuration =
      Number(doctorExists.consultationDuration) ||
      Number(doctorExists.department?.consultationDuration) ||
      15;

    // ==========================================
    // 6. Generate all possible slots
    //    10:00 AM -> 5:00 PM
    // ==========================================

    const openingMinutes = 10 * 60;
    const closingMinutes = 17 * 60;

    const allSlots = [];

    for (
      let startMinutes = openingMinutes;
      startMinutes + consultationDuration <= closingMinutes;
      startMinutes += consultationDuration
    ) {
      const endMinutes =
        startMinutes + consultationDuration;

      const startHour = Math.floor(startMinutes / 60);
      const startMinute = startMinutes % 60;

      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;

      const startTime = new Date(selectedDate);
      startTime.setHours(
        startHour,
        startMinute,
        0,
        0
      );

      const endTime = new Date(selectedDate);
      endTime.setHours(
        endHour,
        endMinute,
        0,
        0
      );

      allSlots.push({
        start: startTime,
        end: endTime,
        value: `${String(startHour).padStart(2, "0")}:${String(
          startMinute
        ).padStart(2, "0")}`,
        label: `${startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      });
    }

    // ==========================================
    // 7. Get existing appointments for doctor
    // ==========================================

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments =
      await Appointment.find({
        doctor,
        status: {
          $nin: ["Cancelled", "No Show"],
        },
        appointmentStart: {
          $lt: dayEnd,
        },
        appointmentEnd: {
          $gt: dayStart,
        },
      })
        .select("appointmentStart appointmentEnd")
        .lean();

    // ==========================================
    // 8. Remove booked/conflicting slots
    // ==========================================

    const availableSlots = allSlots.filter((slot) => {
      const isBooked = existingAppointments.some(
        (appointment) => {
          const existingStart = new Date(
            appointment.appointmentStart
          );

          const existingEnd = new Date(
            appointment.appointmentEnd
          );

          return (
            slot.start < existingEnd &&
            slot.end > existingStart
          );
        }
      );

      return !isBooked;
    });

    // ==========================================
    // 9. If today, remove past slots
    // ==========================================

    const now = new Date();

    const finalSlots = availableSlots.filter(
      (slot) => {
        if (
          selectedDate.toDateString() ===
          now.toDateString()
        ) {
          return slot.start > now;
        }

        return true;
      }
    );

    // ==========================================
    // 10. Response
    // ==========================================

    return res.status(200).json({
      success: true,
      doctorId: doctor,
      date,
      consultationDuration,
      slots: finalSlots.map((slot) => ({
        value: slot.value,
        label: slot.label,
        appointmentStart: slot.start.toISOString(),
        appointmentEnd: slot.end.toISOString(),
      })),
    });
  } catch (error) {
    console.error(
      "Get receptionist available slots error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Live Doctor Availability Status
// ==========================================

export const getDoctorsStatus = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .populate("user", "fullName email")
      .populate("department", "name")
      .lean();

    const now = new Date();

    const result = await Promise.all(
      doctors.map(async (doc) => {
        // Check if there is an active appointment currently in consultation
        const activeAppointment = await Appointment.findOne({
          doctor: doc._id,
          status: "In Consultation",
        }).sort({ appointmentStart: -1 });

        let currentStatus = doc.status || "Available";
        let roomNumber = doc.roomNumber
          ? doc.roomNumber.startsWith("Room")
            ? doc.roomNumber
            : `Room ${doc.roomNumber}`
          : "Room 302";
        let currentInfo = "Current : -";
        let tone = "available";
        let statusText = "🟢 Available";

        if (currentStatus === "Off Duty") {
          tone = "off-duty";
          statusText = "⚪ Off Duty";
          if (doc.offDutyUntil) {
            const until = new Date(doc.offDutyUntil);
            const isTomorrow = until.getDate() === now.getDate() + 1;
            const timeStr = until.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            currentInfo = isTomorrow
              ? `Returns Tomorrow ${timeStr}`
              : `Returns ${until.toLocaleDateString("en-US", { weekday: "long" })}`;
          } else {
            currentInfo = "Returns Tomorrow 08:00";
          }
        } else if (activeAppointment || currentStatus === "In Consultation") {
          currentStatus = "In Consultation";
          tone = "consultation";
          statusText = "🔴 In Consultation";
          roomNumber = doc.roomNumber
            ? doc.roomNumber.startsWith("Room")
              ? doc.roomNumber
              : `Room ${doc.roomNumber}`
            : "Room 105";

          if (activeAppointment && activeAppointment.appointmentEnd) {
            const end = new Date(activeAppointment.appointmentEnd);
            const diffMs = end.getTime() - now.getTime();
            const diffMin = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
            currentInfo = `Ends in ${diffMin} min`;
          } else {
            currentInfo = "Ends in 15 min";
          }
        }

        return {
          id: doc._id,
          doctorId: doc._id,
          name: doc.user?.fullName ? `Dr. ${doc.user.fullName}` : "Doctor",
          department: doc.department?.name || "General",
          status: statusText,
          statusCode: currentStatus,
          tone,
          room: roomNumber,
          currentInfo,
          image:
            doc.profilePhoto ||
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
          offDutyUntil: doc.offDutyUntil,
        };
      })
    );

    return res.status(200).json({
      success: true,
      doctors: result,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctor availability status.",
    });
  }
};

// ==========================================
// Update Doctor Availability Status (Receptionist)
// ==========================================

export const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, offDutyUntil } = req.body;

    if (status === "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Status 'In Consultation' is managed automatically when consultations start.",
      });
    }

    if (!["Available", "Off Duty"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Available' or 'Off Duty'.",
      });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    doctor.status = status;
    if (status === "Off Duty") {
      doctor.offDutyUntil = offDutyUntil
        ? new Date(offDutyUntil)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else {
      doctor.offDutyUntil = null;
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: `Doctor status updated to ${status}.`,
      doctor,
    });
  } catch (error) {
    console.error("Error updating doctor status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update doctor status.",
    });
  }
};