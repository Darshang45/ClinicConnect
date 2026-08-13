import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { validateDoctor } from "../validators/doctor.validator.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";
import { paginateQuery } from "../utils/paginate.js";
import PrescriptionItem from "../models/PrescriptionItem.js";

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
    const filter = { isActive: true };
    const response = await paginateQuery({
      model: Doctor,
      filter,
      query: Doctor.find(filter)
        .populate("user", "fullName email phone")
        .populate("department", "name code")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Doctors retrieved successfully.",
      legacy: { dataKey: "doctors", totalKey: "total" },
    });

    return res.status(200).json(response);
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

    const filter = {
      isActive: true,
      specialization: {
        $regex: keyword,
        $options: "i",
      },
    };
    const response = await paginateQuery({
      model: Doctor,
      filter,
      query: Doctor.find(filter)
        .populate("user", "fullName email")
        .populate("department", "name")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Doctors retrieved successfully.",
      legacy: { dataKey: "doctors" },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorsByDepartment = async (req, res) => {
  try {
    const filter = {
      department: req.params.departmentId,
      isActive: true,
      isAvailable: true,
    };
    const response = await paginateQuery({
      model: Doctor,
      filter,
      query: Doctor.find(filter)
        .populate("user", "fullName")
        .populate("department", "name"),
      pagination: req.query,
      message: "Doctors retrieved successfully.",
      legacy: { dataKey: "doctors", totalKey: "total" },
    });

    return res.status(200).json(response);
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

    // Use IST (UTC+05:30) day boundaries to match how appointments are stored
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(Date.now() + IST_OFFSET_MS);
    const istDateStr = nowIST.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const startOfDay = new Date(`${istDateStr}T00:00:00+05:30`);
    const endOfDay = new Date(`${istDateStr}T23:59:59.999+05:30`);

    const filter = {
      doctor: doctorId,
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["Scheduled", "Checked-In", "In Consultation"],
      },
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
        .populate("patient", "patientId fullName phone gender")
        .sort({ appointmentStart: 1 }),
      pagination: req.query,
      message: "Today's appointments retrieved successfully.",
      legacy: { dataKey: "appointments", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
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

    return res.status(200).json(response);
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

    const age = appointment.patient?.dateOfBirth
      ? new Date().getFullYear() -
        new Date(appointment.patient.dateOfBirth).getFullYear()
      : appointment.patient?.age || null;

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
        _id: appointment.patient?._id,
        patientId: appointment.patient?.patientId,
        fullName: appointment.patient?.fullName,
        gender: appointment.patient?.gender,
        age,
        phone: appointment.patient?.phone,
        bloodGroup: appointment.patient?.bloodGroup,
        allergies: appointment.patient?.allergies,
        chronicDiseases: appointment.patient?.chronicDiseases,
      },

      doctor: {
        _id: appointment.doctor._id,
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

    const filter = {
      patient: patientId,
      status: "Completed",
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName",
          },
        })
        .populate("department", "name")
        .sort({ appointmentStart: -1 }),
      pagination: req.query,
      message: "Patient history retrieved successfully.",
      legacy: { dataKey: "history", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
      appointmentId: appointment._id,
      appointmentDate: appointment.appointmentStart.toISOString().split("T")[0],

      consultationType: appointment.consultationType,

      doctor: appointment.doctor.user.fullName,

      department: appointment.department.name,

      reason: appointment.reason,

      prescription: appointment.prescription,

      reports: appointment.reports,

      followUpDate: appointment.followUpDate,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Search Patients
// ===========================================

export const searchPatients = async (req, res) => {
  try {
    const keyword = (req.query.q || "").trim();

    if (!keyword) {
      return res.status(200).json({
        success: true,
        patients: [],
      });
    }

    // Get logged-in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id,
      isActive: true,
    }).lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Search patients by name, patient ID or phone
    const patients = await Patient.find({
      $or: [
        {
          fullName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          patientId: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .limit(15)
      .lean();

    // Use IST (UTC+05:30) day boundaries to match how appointments are stored
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(Date.now() + IST_OFFSET_MS);
    const istDateStr = nowIST.toISOString().slice(0, 10);

    const startOfDay = new Date(`${istDateStr}T00:00:00+05:30`);
    const endOfDay = new Date(`${istDateStr}T23:59:59.999+05:30`);

    const results = await Promise.all(
      patients.map(async (patient) => {
        const appointment = await Appointment.findOne({
          patient: patient._id,
          doctor: doctor._id,
          appointmentStart: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        })
          .select("_id status tokenNumber appointmentStart")
          .lean();

        const lastAppointment = await Appointment.findOne({
          patient: patient._id,
        })
          .sort({ appointmentStart: -1 })
          .select("appointmentStart")
          .lean();

        return {
          _id: patient._id,

          patientId: patient.patientId,

          fullName: patient.fullName,

          phone: patient.phone,

          gender: patient.gender,

          bloodGroup: patient.bloodGroup,

          hasAppointmentToday: Boolean(appointment),

          appointmentId: appointment?._id || null,

          appointmentStatus: appointment?.status || null,

          appointmentTime: appointment?.appointmentStart || null,

          tokenNumber: appointment?.tokenNumber || null,

          lastVisit: lastAppointment?.appointmentStart || null,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      total: results.length,
      patients: results,
    });
  } catch (error) {
    console.error("Search Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Get Patient Medical Record
// ===========================================

export const getPatientRecord = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const appointments = await Appointment.find({
      patient: patientId,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate("department", "name")
      .sort({
        appointmentStart: -1,
      })
      .lean();

    let prescriptions = await Prescription.find({
      patient: patientId,
    })
      .populate("doctor", "specialization")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ==========================================
    // Fetch Prescription Items
    // ==========================================

    const prescriptionIds = prescriptions.map((p) => p._id);

   const prescriptionItems = await PrescriptionItem.find({
  prescription: { $in: prescriptionIds },
})
.populate(
  "medicine",
  "name genericName strength brand category"
)
.lean();

    const medicinesMap = new Map();

    prescriptionItems.forEach((item) => {
      const key = item.prescription.toString();

      if (!medicinesMap.has(key)) {
        medicinesMap.set(key, []);
      }

      medicinesMap.get(key).push(item);
    });

    prescriptions = prescriptions.map((prescription) => ({
      ...prescription,
      medicines: medicinesMap.get(prescription._id.toString()) || [],
    }));
    

    return res.status(200).json({
      success: true,
      patient,
      appointments,
      prescriptions,
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

    if (appointment.status === "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Consultation has already started.",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Consultation has already been completed.",
      });
    }

    if (
      appointment.status !== "Scheduled" &&
      appointment.status !== "Checked-In"
    ) {
      return res.status(400).json({
        success: false,
        message: "Consultation cannot be started.",
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

    if (appointment.status === "Completed") {
      return res.status(200).json({
        success: true,
        message: "Consultation has already been completed.",
        appointment: {
          appointmentId: appointment._id,
          status: appointment.status,
          consultationStartTime: appointment.consultationStartTime,
          consultationEndTime: appointment.consultationEndTime,
        },
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

export const getUpcomingAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const filter = {
      doctor: doctor._id,
      status: {
        $in: ["Booked", "Checked-In"],
      },
    };
    const response = await paginateQuery({
      model: Appointment,
      filter,
      query: Appointment.find(filter)
        .populate("patient", "patientId fullName phone")
        .sort({ appointmentStart: 1 }),
      pagination: req.query,
      message: "Upcoming appointments retrieved successfully.",
      legacy: { dataKey: "appointments", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
      appointmentId: appointment._id,
      patientId: appointment.patient.patientId,
      patientName: appointment.patient.fullName,
      phone: appointment.patient.phone,
      appointmentStart: appointment.appointmentStart,
      appointmentEnd: appointment.appointmentEnd,
      consultationType: appointment.consultationType,
      tokenNumber: appointment.tokenNumber,
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

export const getRecentPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
      status: "Completed",
    })
      .select("patient consultationEndTime")
      .populate("patient", "patientId fullName phone gender bloodGroup")
      .sort({
        consultationEndTime: -1,
      })
      .lean();

    const uniquePatients = [];

    const seen = new Set();

    appointments.forEach((appointment) => {
      const patient = appointment.patient;

      if (!seen.has(patient._id.toString())) {
        seen.add(patient._id.toString());

        uniquePatients.push({
          patientId: patient.patientId,
          fullName: patient.fullName,
          phone: patient.phone,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          lastVisit: appointment.consultationEndTime,
        });
      }
    });

    return res.status(200).json({
      success: true,
      total: uniquePatients.length,
      patients: uniquePatients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const prescriptions = await Prescription.find({
      doctor: doctor._id,
    })
      .populate("patient", "patientId fullName")
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    const data = prescriptions.map((prescription) => ({
      prescriptionId: prescription._id,
      patientId: prescription.patient.patientId,
      patientName: prescription.patient.fullName,
      diagnosis: prescription.diagnosis,
      createdAt: prescription.createdAt,
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      prescriptions: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Doctor Dashboard
// ===========================================

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
      isActive: true,
    }).lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Use IST (UTC+05:30) day boundaries to match how appointments are stored
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(Date.now() + IST_OFFSET_MS);
    const istDateStr = nowIST.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const startOfDay = new Date(`${istDateStr}T00:00:00+05:30`);
    const endOfDay = new Date(`${istDateStr}T23:59:59.999+05:30`);

    // ===========================================
    // Today's Queue
    // ===========================================
    const todayQueue = await Appointment.find({
      doctor: doctor._id,
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("patient", "patientId fullName phone")
      .sort({ appointmentStart: 1 })
      .lean();

    const formattedTodayQueue = todayQueue.map((appointment) => ({
      appointmentId: appointment._id,

      patientId: appointment.patient?.patientId || "N/A",

      patientName: appointment.patient?.fullName || "Patient",

      patientPhone: appointment.patient?.phone || "N/A",

      appointmentTime: appointment.appointmentStart,

      consultationType: appointment.consultationType,

      reason: appointment.reason,

      status: appointment.status,

      tokenNumber: appointment.tokenNumber,
    }));

    // Upcoming Appointments
    const upcomingAppointments = await Appointment.find({
      doctor: doctor._id,
      status: {
        $in: ["Scheduled", "Checked-In"],
      },
    })
      .populate("patient", "patientId fullName phone")
      .sort({ appointmentStart: 1 })
      .limit(5)
      .lean();

    // Recent Patients
    const recentPatients = await Appointment.find({
      doctor: doctor._id,
      status: "Completed",
    })
      .populate("patient", "patientId fullName gender bloodGroup phone")
      .sort({ consultationEndTime: -1 })
      .limit(5)
      .lean();

    // Recent Prescriptions
    const recentPrescriptions = await Prescription.find({
      doctor: doctor._id,
    })
      .populate("patient", "patientId fullName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Dashboard Stats
    const stats = {
      todayPatients: todayQueue.length,

      pendingConsultations: todayQueue.filter(
        (appointment) =>
          appointment.status === "Scheduled" ||
          appointment.status === "Checked-In" ||
          appointment.status === "In Consultation",
      ).length,

      completedConsultations: todayQueue.filter(
        (appointment) => appointment.status === "Completed",
      ).length,

      prescriptionsIssued: await Prescription.countDocuments({
        doctor: doctor._id,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),
    };

    return res.status(200).json({
      success: true,
      stats,
      todayQueue: formattedTodayQueue,
      upcomingAppointments,
      recentPatients,
      recentPrescriptions,
    });
  } catch (error) {
    console.error("Doctor Dashboard Error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

// ===========================================
// Update Consultation
// ===========================================

export const updateConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const { symptoms, notes, followUpDate } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (symptoms !== undefined) {
      appointment.symptoms = symptoms;
    }

    if (notes !== undefined) {
      appointment.notes = notes;
    }

    if (followUpDate !== undefined) {
      appointment.followUpDate = followUpDate;
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Consultation updated successfully.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
