import Patient from "../models/Patient.js";
import { validatePatient } from "../validators/patient.validator.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";

//Patient ID generator

const generatePatientId = async () => {
  const lastPatient = await Patient.findOne().sort({ createdAt: -1 });

  if (!lastPatient) {
    return "PAT000001";
  }

  const lastId = parseInt(lastPatient.patientId.substring(3));

  const newId = lastId + 1;

  return `PAT${String(newId).padStart(6, "0")}`;
};

//Create Patient

export const createPatient = async (req, res) => {
  try {
    // Validate request
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

    // Check duplicate phone
    const phoneExists = await Patient.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // Check duplicate email
    if (email) {
      const emailExists = await Patient.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // Generate Patient ID
    const patientId = await generatePatientId();

    // Create patient
    const patient = await Patient.create({
      patientId,
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
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully.",
      patient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all Patients

export const getPatients = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      isActive: true,
      fullName: {
        $regex: search,
        $options: "i",
      },
    };

    const totalPatients = await Patient.countDocuments(query);

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalPatients,
      currentPage: page,
      totalPages: Math.ceil(totalPatients / limit),
      patients,
    });
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
    const patient = await Patient.findById(req.params.id);

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

    Object.assign(patient, req.body);

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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

    const patients = await Patient.find({
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
    })
      .select("patientId fullName phone gender bloodGroup dateOfBirth")
      .sort({ fullName: 1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
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
    });

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

    const appointments = await Appointment.find({
      patient: patient._id,
      status: {
        $in: ["Booked", "Checked-In"],
      },
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
        appointmentStart: 1,
      });

    const data = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      doctor: appointment.doctor.user.fullName,
      department: appointment.department.name,
      appointmentStart: appointment.appointmentStart,
      appointmentEnd: appointment.appointmentEnd,
      consultationType: appointment.consultationType,
      tokenNumber: appointment.tokenNumber,
      status: appointment.status,
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      appointments: data,
    });
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
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const prescriptions = await Prescription.find({
      patient: patient._id,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .sort({
        createdAt: -1,
      });

    const data = prescriptions.map((prescription) => ({
      prescriptionId: prescription._id,
      doctor: prescription.doctor.user.fullName,
      diagnosis: prescription.diagnosis,
      medicines: prescription.medicines,
      notes: prescription.notes,
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

export const getAvailableDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      isActive: true,
      isAvailable: true,
    })
      .populate("user", "fullName")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    const data = doctors.map((doctor) => ({
      doctorId: doctor._id,
      name: doctor.user.fullName,
      specialization: doctor.specialization,
      department: doctor.department.name,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      isAvailable: doctor.isAvailable,
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      doctors: data,
    });
  } catch (error) {
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
    }).sort({
      name: 1,
    });

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
