import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { validateDoctor } from "../validators/doctor.validator.js";
import Appointment from "../models/Appointment.js";

export const createDoctor = async (req, res) => {
  try {
    const validation = validateDoctor(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      user,
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      bio,
      profilePhoto,
    } = req.body;

    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (existingUser.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a doctor.",
      });
    }

    const existingDepartment = await Department.findById(department);

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const doctorExists = await Doctor.findOne({
      $or: [{ user }, { licenseNumber }],
    });

    if (doctorExists) {
      return res.status(409).json({
        success: false,
        message: "Doctor already exists.",
      });
    }

    const doctor = await Doctor.create({
      user,
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      bio,
      profilePhoto,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully.",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .populate("user", "fullName email phone")
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user")
      .populate("department");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const {
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      bio,
      profilePhoto,
      isAvailable,
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (department) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "Department not found.",
        });
      }

      doctor.department = department;
    }

    if (licenseNumber && licenseNumber !== doctor.licenseNumber) {
      const existingDoctor = await Doctor.findOne({
        licenseNumber,
      });

      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message: "License number already exists.",
        });
      }

      doctor.licenseNumber = licenseNumber;
    }

    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (bio !== undefined) doctor.bio = bio;
    if (profilePhoto !== undefined) doctor.profilePhoto = profilePhoto;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    doctor.isActive = false;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchDoctors = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const doctors = await Doctor.find({
      isActive: true,
      specialization: {
        $regex: keyword,
        $options: "i",
      },
    })
      .populate("user", "fullName email")
      .populate("department", "name");

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      department: req.params.departmentId,
      isActive: true,
      isAvailable: true,
    })
      .populate("user", "fullName")
      .populate("department", "name");

    return res.status(200).json({
      success: true,
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Get Today's Appointments
// ===========================================

export const getTodayAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Start of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // End of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["Scheduled", "Checked-In", "In Consultation"],
      },
    })
      .populate("patient", "patientId fullName phone gender")
      .sort({ tokenNumber: 1 });

    const formattedAppointments = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      tokenNumber: appointment.tokenNumber,
      patientId: appointment.patient.patientId,
      patientName: appointment.patient.fullName,
      patientPhone: appointment.patient.phone,
      appointmentTime: appointment.appointmentStart,
      consultationType: appointment.consultationType,
      reason: appointment.reason,
      status: appointment.status,
    }));

    return res.status(200).json({
      success: true,
      total: formattedAppointments.length,
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Get Appointment Details
// ===========================================

export const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName email phone",
        },
      })
      .populate("department");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const age =
      new Date().getFullYear() -
      new Date(appointment.patient.dateOfBirth).getFullYear();

    const formattedAppointment = {
      appointmentId: appointment._id,
      tokenNumber: appointment.tokenNumber,
      status: appointment.status,
      appointmentDate: appointment.appointmentStart.toISOString().split("T")[0],
      appointmentTime: appointment.appointmentStart.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        },
      ),

      consultationType: appointment.consultationType,
      reason: appointment.reason,
      symptoms: appointment.symptoms,
      notes: appointment.notes,

      patient: {
        patientId: appointment.patient.patientId,
        fullName: appointment.patient.fullName,
        gender: appointment.patient.gender,
        age,
        phone: appointment.patient.phone,
        bloodGroup: appointment.patient.bloodGroup,
        allergies: appointment.patient.allergies,
        chronicDiseases: appointment.patient.chronicDiseases,
      },

      doctor: {
        doctorId: appointment.doctor._id,
        name: appointment.doctor.user.fullName,
        specialization: appointment.doctor.specialization,
      },

      department: {
        name: appointment.department.name,
      },

      timeline: {
        checkInTime: appointment.checkInTime,
        consultationStartTime: appointment.consultationStartTime,
        consultationEndTime: appointment.consultationEndTime,
      },
    };

    return res.status(200).json({
      success: true,
      appointment: formattedAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// ===========================================
// Get Patient History
// ===========================================

export const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await Appointment.find({
      patient: patientId,
      status: "Completed",
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate("department", "name")
      .sort({ appointmentStart: -1 });

    const history = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      appointmentDate: appointment.appointmentStart
        .toISOString()
        .split("T")[0],

      consultationType: appointment.consultationType,

      doctor: appointment.doctor.user.fullName,

      department: appointment.department.name,

      reason: appointment.reason,

      prescription: appointment.prescription,

      reports: appointment.reports,

      followUpDate: appointment.followUpDate,
    }));

    return res.status(200).json({
      success: true,
      total: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// ===========================================
// Start Consultation
// ===========================================

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

    if (appointment.status !== "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Only checked-in patients can start consultation.",
      });
    }

    appointment.status = "In Consultation";
    appointment.consultationStartTime = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Consultation started successfully.",
      appointment: {
        appointmentId: appointment._id,
        status: appointment.status,
        consultationStartTime: appointment.consultationStartTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ===========================================
// Complete Consultation
// ===========================================

export const completeConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Only consultations in progress can be completed.",
      });
    }

    appointment.status = "Completed";
    appointment.consultationEndTime = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Consultation completed successfully.",
      appointment: {
        appointmentId: appointment._id,
        status: appointment.status,
        consultationStartTime: appointment.consultationStartTime,
        consultationEndTime: appointment.consultationEndTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};