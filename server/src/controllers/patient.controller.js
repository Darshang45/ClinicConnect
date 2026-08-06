import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { validatePatient } from "../validators/patient.validator.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import PrescriptionItem from "../models/PrescriptionItem.js";
import MedicalReport from "../models/MedicalReport.js";
import ActivityLog from "../models/ActivityLog.js";
import HealthMetric from "../models/HealthMetric.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import { paginateQuery } from "../utils/paginate.js";
import { calculateAppointmentTime } from "../services/appointment.service.js";
import { logActivity } from "../utils/activityLogger.js";
import { generatePrescriptionPDF } from "../utils/pdfGenerator.js";

// Calculate age from dateOfBirth; fall back to stored age if DOB is unavailable
const calculateAge = (dateOfBirth, storedAge) => {
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
      }
      return age;
    }
  }
  return storedAge !== undefined && storedAge !== null ? storedAge : null;
};

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
    const patientDoc = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patientDoc) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const upcomingAppointments = await Appointment.countDocuments({
      patient: patientDoc._id,
      status: {
        $in: ["Scheduled", "Checked-In"],
      },
    });

    const completedAppointments = await Appointment.countDocuments({
      patient: patientDoc._id,
      status: "Completed",
    });

    const cancelledAppointments = await Appointment.countDocuments({
      patient: patientDoc._id,
      status: "Cancelled",
    });

    const activePrescriptions = await Prescription.countDocuments({
      patient: patientDoc._id,
    });

    const nextAppointmentDoc = await Appointment.findOne({
      patient: patientDoc._id,
      status: {
        $in: ["Scheduled", "Checked-In"],
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
      .sort({ appointmentStart: 1 })
      .lean();

    let nextAppointment = null;
    if (nextAppointmentDoc) {
      nextAppointment = {
        appointmentId: nextAppointmentDoc._id,
        doctor: nextAppointmentDoc.doctor?.user?.fullName || "Doctor",
        specialization: nextAppointmentDoc.doctor?.specialization || "Specialist",
        department: nextAppointmentDoc.department?.name || "General",
        appointmentStart: nextAppointmentDoc.appointmentStart,
        appointmentEnd: nextAppointmentDoc.appointmentEnd,
        consultationType: nextAppointmentDoc.consultationType,
        tokenNumber: nextAppointmentDoc.tokenNumber,
        status: nextAppointmentDoc.status,
      };
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        patientName: patientDoc.fullName,
        bloodGroup: patientDoc.bloodGroup,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        activePrescriptions,
        stats: {
          upcomingAppointments,
          completedAppointments,
          cancelledAppointments,
          activePrescriptions,
        },
        nextAppointment,
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
        age: calculateAge(patient.dateOfBirth, patient.age),
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
      fullName,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      allergies,
      chronicDiseases,
      emergencyContact,
      insurance,
    } = req.body;

    if (fullName !== undefined && fullName.trim()) {
      patient.fullName = fullName.trim();
      if (patient.user) {
        await User.findByIdAndUpdate(patient.user, { fullName: fullName.trim() });
      }
    }

    if (phone !== undefined && phone.trim()) {
      if (phone.trim() !== patient.phone) {
        const phoneExists = await Patient.findOne({
          phone: phone.trim(),
          _id: { $ne: patient._id },
        });

        if (phoneExists) {
          return res.status(400).json({
            success: false,
            message: "Phone number is already in use by another account.",
          });
        }
      }
      patient.phone = phone.trim();
      if (patient.user) {
        await User.findByIdAndUpdate(patient.user, { phone: phone.trim() });
      }
    }

    if (gender !== undefined) patient.gender = gender;

    if (dateOfBirth !== undefined) patient.dateOfBirth = dateOfBirth;

    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;

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
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        dateOfBirth: patient.dateOfBirth,
        age: calculateAge(patient.dateOfBirth, patient.age),
        address: patient.address,
        allergies: patient.allergies,
        chronicDiseases: patient.chronicDiseases,
        emergencyContact: patient.emergencyContact,
        insurance: patient.insurance,
        createdAt: patient.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update profile. Please try again.",
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

    const { status, search } = req.query;

    const filter = {
      patient: patient._id,
    };

    if (status === "Completed") {
      filter.status = "Completed";
    } else if (status === "Cancelled") {
      filter.status = "Cancelled";
    } else if (status === "Upcoming") {
      filter.status = {
        $in: ["Scheduled", "Checked-In", "In Consultation"],
      };
    } else if (status === "All" || status === "" || !status) {
      // no status filter -> fetch all appointments
    } else {
      filter.status = {
        $in: ["Scheduled", "Checked-In", "In Consultation"],
      };
    }

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
        .sort({ appointmentStart: status === "Completed" || status === "Cancelled" ? -1 : 1 }),
      pagination: req.query,
      message: "Appointments retrieved successfully.",
      legacy: { dataKey: "appointments", totalKey: "total" },
    });

    let mappedData = response.data.map((appointment) => ({
      appointmentId: appointment._id,
      doctor: appointment.doctor?.user?.fullName || "Doctor",
      specialization: appointment.doctor?.specialization || "Specialist",
      department: appointment.department?.name || "General",
      appointmentStart: appointment.appointmentStart,
      appointmentEnd: appointment.appointmentEnd,
      consultationType: appointment.consultationType,
      tokenNumber: appointment.tokenNumber,
      status: appointment.status,
      reason: appointment.reason,
    }));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      mappedData = mappedData.filter(
        (item) =>
          item.doctor.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.specialization.toLowerCase().includes(q) ||
          (item.appointmentStart && new Date(item.appointmentStart).toLocaleDateString().toLowerCase().includes(q))
      );
    }

    response.data = mappedData;

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
      .select("_id patientId")
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

    const prescriptionIds = response.data.map((prescription) => prescription._id);
    const prescriptionItems = prescriptionIds.length
      ? await PrescriptionItem.find({
          prescription: { $in: prescriptionIds },
        })
          .populate("medicine")
          .lean()
      : [];

    const medicinesByPrescription = new Map();
    for (const item of prescriptionItems) {
      const key = item.prescription.toString();
      const list = medicinesByPrescription.get(key) || [];
      list.push({
        id: item._id,
        medicine: item.medicine?.name || "N/A",
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions,
      });
      medicinesByPrescription.set(key, list);
    }

    response.data = response.data.map((prescription) => ({
      prescriptionId: prescription._id,
      patientId: patient.patientId || "",
      doctor: prescription.doctor?.user?.fullName || "Doctor",
      diagnosis: prescription.diagnosis,
      medicines: medicinesByPrescription.get(prescription._id.toString()) || [],
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
    const response = await paginateQuery({
      model: Doctor,
      filter,
      query: Doctor.find(filter)
        .populate("user", "fullName")
        .populate("department", "name")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Available doctors retrieved successfully.",
      legacy: { dataKey: "doctors", totalKey: "total" },
    });

    response.data = response.data.map((doctor) => ({
      doctorId: doctor._id,
      name: doctor.user.fullName,
      specialization: doctor.specialization,
      department: doctor.department.name,
      departmentId: doctor.department._id,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      isAvailable: doctor.isAvailable,
    }));

    return res.status(200).json(response);
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

export const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
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
      .lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      appointment: {
        appointmentId: appointment._id,
        doctorId: appointment.doctor?._id,
        doctorName: appointment.doctor?.user?.fullName || "Doctor",
        specialization: appointment.doctor?.specialization || "Specialist",
        departmentId: appointment.department?._id,
        departmentName: appointment.department?.name || "Department",
        appointmentStart: appointment.appointmentStart,
        appointmentEnd: appointment.appointmentEnd,
        consultationType: appointment.consultationType,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        status: appointment.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, appointmentTime, consultationType, reasonForVisit, reason, symptoms } = req.body;

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Appointment date and time slot are required.",
      });
    }

    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: patient._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied.",
      });
    }

    if (appointment.status === "Completed" || appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${appointment.status.toLowerCase()} appointment.`,
      });
    }

    const prevDate = appointment.appointmentStart ? new Date(appointment.appointmentStart).toISOString().split("T")[0] : "N/A";
    const prevTime = appointment.appointmentStart ? new Date(appointment.appointmentStart).toTimeString().split(" ")[0].substring(0, 5) : "N/A";

    const { appointmentStart, appointmentEnd } = calculateAppointmentTime(
      appointmentDate,
      appointmentTime
    );

    const newDateStr = appointmentDate;
    const newTimeStr = appointmentTime;

    appointment.appointmentStart = appointmentStart;
    appointment.appointmentEnd = appointmentEnd;
    if (consultationType) {
      appointment.consultationType = consultationType;
    }
    if (reasonForVisit || reason) {
      appointment.reason = reasonForVisit || reason;
    }
    if (symptoms !== undefined) {
      appointment.symptoms = Array.isArray(symptoms)
        ? symptoms
        : typeof symptoms === "string"
        ? symptoms.split(",").map((s) => s.trim()).filter(Boolean)
        : symptoms;
    }
    appointment.status = "Scheduled";

    await appointment.save();

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "APPOINTMENT_RESCHEDULED",
      module: "Patient",
      description: `Appointment Rescheduled | Previous Date: ${prevDate} | Previous Time: ${prevTime} | New Date: ${newDateStr} | New Time: ${newTimeStr} | Updated By: Patient`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadPrescriptionPDF = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const patient = await Patient.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      patient: patient._id,
    })
      .populate({
        path: "patient",
        populate: { path: "user", select: "fullName email phone" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "fullName email phone" },
      })
      .populate("appointment")
      .lean();

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found or access denied.",
      });
    }

    const prescriptionItems = await PrescriptionItem.find({
      prescription: prescription._id,
    })
      .populate("medicine")
      .lean();

    const medicines = prescriptionItems.map((item) => ({
      medicineName: item.medicine?.name || item.medicineName || "Medicine",
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      quantity: item.quantity,
      instructions: item.instructions,
    }));

    const pdfBuffer = generatePrescriptionPDF({
      ...prescription,
      medicines: medicines.length > 0 ? medicines : prescription.medicines || [],
    });

    const filename = `Prescription_${patient.patientId || prescription._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF Download Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate PDF.",
    });
  }
};

// ===========================================
// Patient Timeline (Phase 4.7)
// Dynamic timeline derived from Appointment,
// Prescription, MedicalReport & ActivityLog
// ===========================================

export const getPatientTimeline = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    // Fetch Appointments, Prescriptions, Medical Reports, Activity Logs
    const [appointments, prescriptions, reports, activityLogs] = await Promise.all([
      Appointment.find({ patient: patient._id })
        .populate({
          path: "doctor",
          populate: { path: "user", select: "fullName" },
        })
        .populate("department")
        .lean(),
      Prescription.find({ patient: patient._id })
        .populate({
          path: "doctor",
          populate: { path: "user", select: "fullName" },
        })
        .lean(),
      MedicalReport.find({ patient: patient._id })
        .populate({
          path: "doctor",
          populate: { path: "user", select: "fullName" },
        })
        .lean(),
      ActivityLog.find({ user: req.user._id }).lean(),
    ]);

    const events = [];

    const formatDate = (isoDate) => {
      if (!isoDate) return "";
      const d = new Date(isoDate);
      return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
    };

    const formatTime = (isoDate) => {
      if (!isoDate) return "";
      const d = new Date(isoDate);
      return isNaN(d.getTime())
        ? ""
        : d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          });
    };

    // 1. Process Appointments
    for (const app of appointments) {
      const doctorObj = {
        id: app.doctor?._id || null,
        name: app.doctor?.user?.fullName ? `Dr. ${app.doctor.user.fullName}` : "Doctor",
      };
      const deptObj = {
        id: app.department?._id || null,
        name: app.department?.name || "General",
      };
      const refObj = {
        appointmentId: app._id,
        prescriptionId: app.prescription || null,
        reportId: null,
      };

      // Event: BOOKED
      events.push({
        id: `apt_booked_${app._id}`,
        eventType: "BOOKED",
        title: "Appointment Booked",
        description: `Scheduled for ${formatDate(app.appointmentStart)} at ${formatTime(app.appointmentStart)}. Reason: ${app.reason || "Consultation"}`,
        timestamp: app.createdAt,
        date: formatDate(app.createdAt),
        time: formatTime(app.createdAt),
        status: app.status,
        doctor: doctorObj,
        department: deptObj,
        reference: refObj,
      });

      // Event: CHECKED_IN
      if (app.checkInTime) {
        events.push({
          id: `apt_checkin_${app._id}`,
          eventType: "CHECKED_IN",
          title: "Checked In at Clinic",
          description: `Checked in for token #${app.tokenNumber || "N/A"}`,
          timestamp: app.checkInTime,
          date: formatDate(app.checkInTime),
          time: formatTime(app.checkInTime),
          status: "Checked-In",
          doctor: doctorObj,
          department: deptObj,
          reference: refObj,
        });
      }

      // Event: CONSULTATION_STARTED
      if (app.consultationStartTime) {
        events.push({
          id: `apt_consult_start_${app._id}`,
          eventType: "CONSULTATION_STARTED",
          title: "Consultation Started",
          description: `Consultation session commenced with ${doctorObj.name}`,
          timestamp: app.consultationStartTime,
          date: formatDate(app.consultationStartTime),
          time: formatTime(app.consultationStartTime),
          status: "In Consultation",
          doctor: doctorObj,
          department: deptObj,
          reference: refObj,
        });
      }

      // Event: CONSULTATION_COMPLETED
      if (app.consultationEndTime) {
        events.push({
          id: `apt_consult_end_${app._id}`,
          eventType: "CONSULTATION_COMPLETED",
          title: "Consultation Completed",
          description: "Doctor completed consultation session",
          timestamp: app.consultationEndTime,
          date: formatDate(app.consultationEndTime),
          time: formatTime(app.consultationEndTime),
          status: "Completed",
          doctor: doctorObj,
          department: deptObj,
          reference: refObj,
        });
      }

      // Event: APPOINTMENT_COMPLETED
      if (app.status === "Completed") {
        const completedTime = app.consultationEndTime || app.updatedAt || app.createdAt;
        events.push({
          id: `apt_completed_${app._id}`,
          eventType: "APPOINTMENT_COMPLETED",
          title: "Appointment Completed",
          description: `Appointment successfully completed in ${deptObj.name}`,
          timestamp: completedTime,
          date: formatDate(completedTime),
          time: formatTime(completedTime),
          status: "Completed",
          doctor: doctorObj,
          department: deptObj,
          reference: refObj,
        });
      }

      // Event: CANCELLED
      if (app.status === "Cancelled") {
        events.push({
          id: `apt_cancelled_${app._id}`,
          eventType: "CANCELLED",
          title: "Appointment Cancelled",
          description: `Reason: ${app.cancellationReason || "Cancelled"}`,
          timestamp: app.updatedAt,
          date: formatDate(app.updatedAt),
          time: formatTime(app.updatedAt),
          status: "Cancelled",
          doctor: doctorObj,
          department: deptObj,
          reference: refObj,
        });
      }
    }

    // 2. Process Prescriptions
    for (const rx of prescriptions) {
      events.push({
        id: `rx_${rx._id}`,
        eventType: "PRESCRIPTION_ISSUED",
        title: "Prescription Issued",
        description: `Diagnosis: ${rx.diagnosis || "Issued prescription"} (${rx.medicines?.length || 0} medicines)`,
        timestamp: rx.createdAt,
        date: formatDate(rx.createdAt),
        time: formatTime(rx.createdAt),
        status: rx.status || "Issued",
        doctor: {
          id: rx.doctor?._id || null,
          name: rx.doctor?.user?.fullName ? `Dr. ${rx.doctor.user.fullName}` : "Doctor",
        },
        department: { id: null, name: "General" },
        reference: {
          appointmentId: rx.appointment || null,
          prescriptionId: rx._id,
          reportId: null,
        },
      });
    }

    // 3. Process Medical Reports
    for (const rep of reports) {
      events.push({
        id: `rep_${rep._id}`,
        eventType: "REPORT_UPLOADED",
        title: `Medical Report: ${rep.title}`,
        description: `${rep.reportType}${rep.findings ? ` — ${rep.findings}` : ""}`,
        timestamp: rep.createdAt,
        date: formatDate(rep.createdAt),
        time: formatTime(rep.createdAt),
        status: rep.status || "Completed",
        doctor: {
          id: rep.doctor?._id || null,
          name: rep.doctor?.user?.fullName ? `Dr. ${rep.doctor.user.fullName}` : "Doctor",
        },
        department: { id: null, name: "Diagnostics" },
        reference: {
          appointmentId: rep.appointment || null,
          prescriptionId: null,
          reportId: rep._id,
        },
      });
    }

    // 4. Process ActivityLogs for RESCHEDULED events
    for (const log of activityLogs) {
      if (
        log.action === "APPOINTMENT_RESCHEDULED" ||
        (log.module === "Appointment" && log.action?.includes("RESCHEDULE"))
      ) {
        events.push({
          id: `log_resched_${log._id}`,
          eventType: "RESCHEDULED",
          title: "Appointment Rescheduled",
          description: log.description || "Appointment time was updated",
          timestamp: log.createdAt,
          date: formatDate(log.createdAt),
          time: formatTime(log.createdAt),
          status: "Rescheduled",
          doctor: { id: null, name: null },
          department: { id: null, name: null },
          reference: { appointmentId: null, prescriptionId: null, reportId: null },
        });
      }
    }

    // Sort newest first
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const totalEvents = events.length;
    const totalPages = Math.ceil(totalEvents / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedEvents = events.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      success: true,
      totalEvents,
      totalPages,
      currentPage: page,
      limit,
      timeline: paginatedEvents,
    });
  } catch (error) {
    console.error("Patient Timeline Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load timeline.",
    });
  }
};

// ===========================================
// Health Metrics Controllers (Phase 4.8)
// Separate HealthMetric collection CRUD
// ===========================================

const calculateBMIHelper = (height, weight) => {
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
    const heightInMeters = h / 100;
    return Math.round((w / (heightInMeters * heightInMeters)) * 10) / 10;
  }
  return null;
};

// Get Patient Health Metrics
export const getPatientHealthMetrics = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { patient: patient._id };
    const totalMetrics = await HealthMetric.countDocuments(filter);
    const totalPages = Math.ceil(totalMetrics / limit) || 1;

    const metrics = await HealthMetric.find(filter)
      .sort({ recordedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      totalMetrics,
      totalPages,
      currentPage: page,
      limit,
      metrics,
    });
  } catch (error) {
    console.error("Get Health Metrics Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve health metrics.",
    });
  }
};

// Create Patient Health Metric
export const createPatientHealthMetric = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const {
      height,
      weight,
      bloodPressure,
      heartRate,
      bloodSugar,
      oxygenLevel,
      temperature,
      notes,
      recordedAt,
    } = req.body;

    // Numerical validation checks
    if (height !== undefined && height !== null && (isNaN(height) || height < 0)) {
      return res.status(400).json({ success: false, message: "Height must be a non-negative number." });
    }
    if (weight !== undefined && weight !== null && (isNaN(weight) || weight < 0)) {
      return res.status(400).json({ success: false, message: "Weight must be a non-negative number." });
    }
    if (oxygenLevel !== undefined && oxygenLevel !== null && (isNaN(oxygenLevel) || oxygenLevel < 0 || oxygenLevel > 100)) {
      return res.status(400).json({ success: false, message: "Oxygen level must be between 0 and 100." });
    }

    const bmi = calculateBMIHelper(height, weight);

    const metric = await HealthMetric.create({
      patient: patient._id,
      height: height !== undefined ? height : null,
      weight: weight !== undefined ? weight : null,
      bmi,
      bloodPressure: bloodPressure ? String(bloodPressure).trim() : "",
      heartRate: heartRate !== undefined ? heartRate : null,
      bloodSugar: bloodSugar !== undefined ? bloodSugar : null,
      oxygenLevel: oxygenLevel !== undefined ? oxygenLevel : null,
      temperature: temperature !== undefined ? temperature : null,
      notes: notes ? String(notes).trim() : "",
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      recordedBy: "Patient",
    });

    return res.status(201).json({
      success: true,
      message: "Health metric recorded successfully.",
      metric,
    });
  } catch (error) {
    console.error("Create Health Metric Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to record health metric.",
    });
  }
};

// Update Patient Health Metric
export const updatePatientHealthMetric = async (req, res) => {
  try {
    const { metricId } = req.params;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const metric = await HealthMetric.findById(metricId);
    if (!metric) {
      return res.status(404).json({
        success: false,
        message: "Health metric record not found.",
      });
    }

    if (!metric.patient.equals(patient._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only modify your own records.",
      });
    }

    const {
      height,
      weight,
      bloodPressure,
      heartRate,
      bloodSugar,
      oxygenLevel,
      temperature,
      notes,
      recordedAt,
    } = req.body;

    if (height !== undefined && height !== null && (isNaN(height) || height < 0)) {
      return res.status(400).json({ success: false, message: "Height must be a non-negative number." });
    }
    if (weight !== undefined && weight !== null && (isNaN(weight) || weight < 0)) {
      return res.status(400).json({ success: false, message: "Weight must be a non-negative number." });
    }
    if (oxygenLevel !== undefined && oxygenLevel !== null && (isNaN(oxygenLevel) || oxygenLevel < 0 || oxygenLevel > 100)) {
      return res.status(400).json({ success: false, message: "Oxygen level must be between 0 and 100." });
    }

    if (height !== undefined) metric.height = height;
    if (weight !== undefined) metric.weight = weight;
    if (bloodPressure !== undefined) metric.bloodPressure = String(bloodPressure).trim();
    if (heartRate !== undefined) metric.heartRate = heartRate;
    if (bloodSugar !== undefined) metric.bloodSugar = bloodSugar;
    if (oxygenLevel !== undefined) metric.oxygenLevel = oxygenLevel;
    if (temperature !== undefined) metric.temperature = temperature;
    if (notes !== undefined) metric.notes = String(notes).trim();
    if (recordedAt !== undefined) metric.recordedAt = new Date(recordedAt);

    metric.bmi = calculateBMIHelper(metric.height, metric.weight);

    await metric.save();

    return res.status(200).json({
      success: true,
      message: "Health metric updated successfully.",
      metric,
    });
  } catch (error) {
    console.error("Update Health Metric Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update health metric.",
    });
  }
};

// Delete Patient Health Metric
export const deletePatientHealthMetric = async (req, res) => {
  try {
    const { metricId } = req.params;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
    }

    const metric = await HealthMetric.findById(metricId);
    if (!metric) {
      return res.status(404).json({
        success: false,
        message: "Health metric record not found.",
      });
    }

    if (!metric.patient.equals(patient._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own records.",
      });
    }

    await HealthMetric.findByIdAndDelete(metricId);

    return res.status(200).json({
      success: true,
      message: "Health metric deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Health Metric Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete health metric.",
    });
  }
};

