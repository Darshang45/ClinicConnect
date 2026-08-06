import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { validatePatient } from "../validators/patient.validator.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import PrescriptionItem from "../models/PrescriptionItem.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import { paginateQuery } from "../utils/paginate.js";
import { calculateAppointmentTime } from "../services/appointment.service.js";
import { logActivity } from "../utils/activityLogger.js";

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
      doctor: prescription.doctor.user.fullName,
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
