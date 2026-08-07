import Patient from "../models/Patient.js";
import { validatePatient } from "../validators/patient.validator.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import { paginateQuery } from "../utils/paginate.js";

//Patient ID generator

// Patient ID generator
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

  return `PAT${String(lastNumber + 1).padStart(6, "0")}`;
};

//Create Patient

export const createPatient = async (req, res) => {
  try {
    // ==========================================
    // 1. Validate required fields
    // ==========================================

    const validation = validatePatient(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
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
    } = req.body;

    // ==========================================
    // 2. Normalize data
    // ==========================================

    const normalizedPhone = phone.trim();

    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;

    // ==========================================
    // 3. Check duplicate phone
    // ==========================================

    const phoneExists = await Patient.findOne({
      phone: normalizedPhone,
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // ==========================================
    // 4. Check duplicate email
    // ==========================================

    if (normalizedEmail) {
      const emailExists = await Patient.findOne({
        email: normalizedEmail,
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email address already exists.",
        });
      }
    }

    // ==========================================
    // 5. Generate Patient ID
    // ==========================================

    const patientId = await generatePatientId();

    // ==========================================
    // 6. Create patient
    // ==========================================

    const patient = await Patient.create({
      patientId,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicDiseases,
      insurance,
    });

    // ==========================================
    // 7. Response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Patient created successfully.",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    // MongoDB duplicate-key protection
    if (error.code === 11000) {
      if (error.keyPattern?.phone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists.",
        });
      }

      if (error.keyPattern?.email) {
        return res.status(409).json({
          success: false,
          message: "Email address already exists.",
        });
      }

      if (error.keyPattern?.patientId) {
        return res.status(409).json({
          success: false,
          message: "Unable to generate a unique patient ID. Please try again.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create patient.",
    });
  }
};

//Get all Patients

export const getPatients = async (req, res) => {
  try {
    const search = req.query.search || "";

    const filter = {
      isActive: true,
      fullName: {
        $regex: search,
        $options: "i",
      },
    };

    const response = await paginateQuery({
      model: Patient,
      filter,
      query: Patient.find(filter).sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Patients retrieved successfully.",
      legacy: {
        dataKey: "patients",
        totalKey: "totalPatients",
        pageKey: "currentPage",
        totalPagesKey: "totalPages",
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Patient by ID

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // ==========================================
    // Last Appointment
    // ==========================================

    const lastAppointment = await Appointment.findOne({
      patient: patient._id,
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

    // ==========================================
    // Latest Prescription
    // ==========================================

    const latestPrescription = await Prescription.findOne({
      patient: patient._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    // ==========================================
    // Appointment Statistics
    // ==========================================

    const totalAppointments = await Appointment.countDocuments({
      patient: patient._id,
    });

    const completedAppointments = await Appointment.countDocuments({
      patient: patient._id,
      status: "Completed",
    });

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      patient: {
        _id: patient._id,
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        bloodGroup: patient.bloodGroup,
        address: patient.address,

        allergies: patient.allergies || [],
        chronicDiseases: patient.chronicDiseases || [],

        emergencyContact: patient.emergencyContact,

        insurance: patient.insurance,
      },

      statistics: {
        totalAppointments,
        completedAppointments,
      },

      lastVisit: lastAppointment
        ? {
            appointmentId: lastAppointment._id,

            date: lastAppointment.appointmentStart,

            department: lastAppointment.department?.name || "N/A",

            doctor: lastAppointment.doctor?.user?.fullName || "Not Assigned",

            status: lastAppointment.status,
          }
        : null,

      recentReport: latestPrescription
        ? {
            diagnosis: latestPrescription.diagnosis,

            medicines: latestPrescription.medicines,

            notes: latestPrescription.notes,

            createdAt: latestPrescription.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Patient

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const {
      fullName,
      email,
      phone,
      address,
      bloodGroup,
      emergencyContact,
      allergies,
      chronicDiseases,
    } = req.body;

    // Do NOT allow editing: patientId, gender, dateOfBirth

    if (fullName !== undefined) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Full name must contain at least 2 characters.",
        });
      }
      patient.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      const cleanPhone = phone.trim();
      if (!/^\d{10}$/.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must contain exactly 10 digits.",
        });
      }

      const existingPhone = await Patient.findOne({
        phone: cleanPhone,
        _id: { $ne: patient._id },
      });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists.",
        });
      }
      patient.phone = cleanPhone;
    }

    if (email !== undefined) {
      const cleanEmail = email ? email.trim().toLowerCase() : "";
      if (cleanEmail) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return res.status(400).json({
            success: false,
            message: "Please enter a valid email address.",
          });
        }

        const existingEmail = await Patient.findOne({
          email: cleanEmail,
          _id: { $ne: patient._id },
        });

        if (existingEmail) {
          return res.status(409).json({
            success: false,
            message: "Email address already exists.",
          });
        }
        patient.email = cleanEmail;
      } else {
        patient.email = undefined;
      }
    }

    if (address !== undefined) patient.address = address;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact;
    if (allergies !== undefined) patient.allergies = allergies;
    if (chronicDiseases !== undefined) patient.chronicDiseases = chronicDiseases;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully.",
      patient,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.phone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists.",
        });
      }
      if (error.keyPattern?.email) {
        return res.status(409).json({
          success: false,
          message: "Email address already exists.",
        });
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update patient profile.",
    });
  }
};

//Soft delete patient

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.isActive = false;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Patient by Phone NO.

export const getPatientByPhone = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      phone: req.params.phone,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Patient by Patient ID
// ==========================================

export const getPatientByPatientId = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.patientId,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Search Patient

export const searchPatients = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || "";

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required.",
      });
    }

    const filter = {
      isActive: true,
      $or: [
        {
          patientId: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          fullName: {
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
    };
    const response = await paginateQuery({
      model: Patient,
      filter,
      query: Patient.find(filter)
        .select("patientId fullName phone gender bloodGroup dateOfBirth")
        .sort({ fullName: 1 }),
      pagination: req.query,
      message: "Patients retrieved successfully.",
      legacy: { dataKey: "patients", totalKey: "count" },
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

export const getPatientDashboard = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const upcomingAppointments = await Appointment.countDocuments({
      patient: patient._id,
      status: {
        $in: ["Booked", "Checked-In"],
      },
    });

    const completedAppointments = await Appointment.countDocuments({
      patient: patient._id,
      status: "Completed",
    });

    const cancelledAppointments = await Appointment.countDocuments({
      patient: patient._id,
      status: "Cancelled",
    });

    const activePrescriptions = await Prescription.countDocuments({
      patient: patient._id,
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        activePrescriptions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    return res.status(200).json({
      success: true,
      patient: {
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        dateOfBirth: patient.dateOfBirth,
        address: patient.address,
        allergies: patient.allergies,
        chronicDiseases: patient.chronicDiseases,
        emergencyContact: patient.emergencyContact,
        insurance: patient.insurance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const {
      phone,
      address,
      allergies,
      chronicDiseases,
      emergencyContact,
      insurance,
    } = req.body;

    if (phone !== undefined) patient.phone = phone;

    if (address !== undefined) patient.address = address;

    if (allergies !== undefined) patient.allergies = allergies;

    if (chronicDiseases !== undefined)
      patient.chronicDiseases = chronicDiseases;

    if (emergencyContact !== undefined)
      patient.emergencyContact = emergencyContact;

    if (insurance !== undefined) patient.insurance = insurance;

    await patient.save();

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "UPDATE_PROFILE",
      module: "Patient",
      description: "Updated patient profile.",
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      patient: {
        patientId: patient.patientId,
        fullName: patient.fullName,
        phone: patient.phone,
        address: patient.address,
        allergies: patient.allergies,
        chronicDiseases: patient.chronicDiseases,
        emergencyContact: patient.emergencyContact,
        insurance: patient.insurance,
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
    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const filter = {
      patient: patient._id,
      status: {
        $in: ["Booked", "Checked-In"],
      },
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
        .sort({ appointmentStart: 1 }),
      pagination: req.query,
      message: "Upcoming appointments retrieved successfully.",
      legacy: { dataKey: "appointments", totalKey: "total" },
    });

    response.data = response.data.map((appointment) => ({
      appointmentId: appointment._id,
      doctor: appointment.doctor.user.fullName,
      department: appointment.department.name,
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

export const getMyPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const filter = {
      patient: patient._id,
    };
    const response = await paginateQuery({
      model: Prescription,
      filter,
      query: Prescription.find(filter)
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName",
          },
        })
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Prescriptions retrieved successfully.",
      legacy: { dataKey: "prescriptions", totalKey: "total" },
    });

    response.data = response.data.map((prescription) => ({
      prescriptionId: prescription._id,
      doctor: prescription.doctor.user.fullName,
      diagnosis: prescription.diagnosis,
      medicines: prescription.medicines,
      notes: prescription.notes,
      createdAt: prescription.createdAt,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableDoctors = async (req, res) => {
  try {
    const filter = {
      isActive: true,
      isAvailable: true,
    };

    // Filter doctors by selected department
    if (req.query.department) {
      filter.department = req.query.department;
    }

    const response = await paginateQuery({
      model: Doctor,
      filter,
      query: Doctor.find(filter)
        .populate("user", "fullName")
        .populate("department", "name consultationDuration")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Available doctors retrieved successfully.",
      legacy: {
        dataKey: "doctors",
        totalKey: "total",
      },
    });

    response.data = response.data.map((doctor) => ({
      doctorId: doctor._id,
      name: doctor.user.fullName,
      specialization: doctor.specialization,
      department: doctor.department?.name || "",
      departmentId: doctor.department?._id || null,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      consultationDuration: doctor.department?.consultationDuration || 15,
      isAvailable: doctor.isAvailable,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get available doctors error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      isActive: true,
    })
      .sort({ name: 1 })
      .lean();

    const data = departments.map((department) => ({
      departmentId: department._id,
      name: department.name,
      description: department.description,
      consultationFee: department.consultationFee,
      consultationDuration: department.consultationDuration,
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      departments: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
