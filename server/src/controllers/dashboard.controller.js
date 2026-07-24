import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Department from "../models/Department.js";
import Prescription from "../models/Prescription.js";
import MedicalReport from "../models/MedicalReport.js";
import Medicine from "../models/Medicine.js";



// ===========================================
// Receptionist Dashboard
// ===========================================

export const getReceptionistDashboard = async (req, res) => {
  try {
    // Start of today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start of tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Fetch today's appointments
    const appointments = await Appointment.find({
      appointmentStart: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate({
        path: "patient",
        select: "patientId fullName",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate("department", "name")
      .sort({ tokenNumber: 1 });

    // Summary counts
    const summary = {
      todayAppointments: appointments.length,
      walkIns: appointments.filter(a => a.bookedBy === "Receptionist").length,
      checkedIn: appointments.filter(a => a.status === "Checked-In").length,
      inConsultation: appointments.filter(a => a.status === "In Consultation").length,
      completed: appointments.filter(a => a.status === "Completed").length,
      cancelled: appointments.filter(a => a.status === "Cancelled").length,
    };

    // Queue
    const queue = appointments
      .filter(a =>
        ["Scheduled", "Checked-In", "In Consultation"].includes(a.status)
      )
      .map(a => ({
        appointmentId: a._id,
        tokenNumber: a.tokenNumber,
        patient: a.patient?.fullName,
        doctor: a.doctor?.user?.fullName,
        status: a.status,
      }));

    // Appointment List
    const appointmentList = appointments.map(a => ({
      appointmentId: a._id,
      tokenNumber: a.tokenNumber,
      patient: a.patient?.fullName,
      doctor: a.doctor?.user?.fullName,
      department: a.department?.name,
      appointmentTime: a.appointmentStart.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }),
      status: a.status,
    }));

    return res.status(200).json({
      success: true,
      summary,
      queue,
      appointments: appointmentList,
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
    const { doctorId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentStart: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("patient", "patientId fullName phone")
      .sort({ tokenNumber: 1 });

    const summary = {
      todayPatients: appointments.length,
      checkedIn: appointments.filter(a => a.status === "Checked-In").length,
      inConsultation: appointments.filter(a => a.status === "In Consultation").length,
      completed: appointments.filter(a => a.status === "Completed").length,
    };

    const nextPatient = appointments.find(a =>
      ["Checked-In", "Scheduled"].includes(a.status)
    );

    const appointmentList = appointments.map(a => ({
      appointmentId: a._id,
      tokenNumber: a.tokenNumber,
      patientId: a.patient?.patientId,
      patientName: a.patient?.fullName,
      phone: a.patient?.phone,
      appointmentTime: a.appointmentStart.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }),
      consultationType: a.consultationType,
      reason: a.reason,
      status: a.status,
    }));

    return res.status(200).json({
      success: true,
      summary,
      nextPatient: nextPatient
        ? {
            appointmentId: nextPatient._id,
            tokenNumber: nextPatient.tokenNumber,
            patientName: nextPatient.patient?.fullName,
            reason: nextPatient.reason,
          }
        : null,
      appointments: appointmentList,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Admin Dashboard
// ===========================================

export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      totalPatients,
      totalDoctors,
      totalDepartments,
      appointmentsToday,
      completedToday,
      pendingToday,
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Department.countDocuments(),
      Appointment.countDocuments({
        appointmentStart: {
          $gte: today,
          $lt: tomorrow,
        },
      }),
      Appointment.countDocuments({
        appointmentStart: {
          $gte: today,
          $lt: tomorrow,
        },
        status: "Completed",
      }),
      Appointment.countDocuments({
        appointmentStart: {
          $gte: today,
          $lt: tomorrow,
        },
        status: {
          $in: ["Scheduled", "Checked-In", "In Consultation"],
        },
      }),
    ]);

    const recentAppointments = await Appointment.find({
      appointmentStart: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("patient", "fullName")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .sort({ appointmentStart: -1 })
      .limit(5);

    const formattedAppointments = recentAppointments.map((appointment) => ({
      appointmentId: appointment._id,
      patient: appointment.patient?.fullName,
      doctor: appointment.doctor?.user?.fullName,
      status: appointment.status,
      appointmentTime: appointment.appointmentStart.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }
      ),
    }));

    return res.status(200).json({
      success: true,
      summary: {
        totalPatients,
        totalDoctors,
        totalDepartments,
        appointmentsToday,
        completedToday,
        pendingToday,
      },
      recentAppointments: formattedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Patient Dashboard
// ===========================================

export const getPatientDashboard = async (req, res) => {
  try {
    const { patientId } = req.params;

    const now = new Date();

    const [
      upcomingAppointments,
      completedAppointments,
      totalPrescriptions,
      totalReports,
    ] = await Promise.all([
      Appointment.countDocuments({
        patient: patientId,
        appointmentStart: { $gte: now },
        status: { $ne: "Cancelled" },
      }),

      Appointment.countDocuments({
        patient: patientId,
        status: "Completed",
      }),

      Prescription.countDocuments({
        patient: patientId,
      }),

      MedicalReport.countDocuments({
        patient: patientId,
      }),
    ]);

    // Next Appointment
    const nextAppointment = await Appointment.findOne({
      patient: patientId,
      appointmentStart: { $gte: now },
      status: { $ne: "Cancelled" },
    })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate("department", "name")
      .sort({ appointmentStart: 1 });

    // Appointment History
    const appointmentHistory = await Appointment.find({
      patient: patientId,
    })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate("department", "name")
      .sort({ appointmentStart: -1 })
      .limit(5);

    // Recent Prescriptions
    const prescriptions = await Prescription.find({
      patient: patientId,
    })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Medical Reports
    const reports = await MedicalReport.find({
      patient: patientId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,

      summary: {
        upcomingAppointments,
        completedAppointments,
        totalPrescriptions,
        totalReports,
      },

      nextAppointment: nextAppointment
        ? {
            appointmentId: nextAppointment._id,
            doctor: nextAppointment.doctor?.user?.fullName,
            specialization: nextAppointment.doctor?.specialization,
            department: nextAppointment.department?.name,
            appointmentDate:
              nextAppointment.appointmentStart.toLocaleDateString("en-IN"),
            appointmentTime:
              nextAppointment.appointmentStart.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Kolkata",
              }),
            consultationType: nextAppointment.consultationType,
            status: nextAppointment.status,
          }
        : null,

      appointmentHistory: appointmentHistory.map((appointment) => ({
        appointmentId: appointment._id,
        doctor: appointment.doctor?.user?.fullName,
        department: appointment.department?.name,
        appointmentDate:
          appointment.appointmentStart.toLocaleDateString("en-IN"),
        appointmentTime:
          appointment.appointmentStart.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
          }),
        status: appointment.status,
      })),

      recentPrescriptions: prescriptions.map((prescription) => ({
        prescriptionId: prescription._id,
        doctor: prescription.doctor?.user?.fullName,
        diagnosis: prescription.diagnosis,
        followUpDate: prescription.followUpDate,
        status: prescription.status,
        issuedOn: prescription.createdAt,
      })),

      recentReports: reports.map((report) => ({
        reportId: report._id,
        title: report.title,
        reportType: report.reportType,
        status: report.status,
        uploadedAt: report.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Pharmacy Dashboard
// ===========================================

export const getPharmacyDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      todayPrescriptions,
      pendingPrescriptions,
      dispensedPrescriptions,
      totalMedicines,
    ] = await Promise.all([
      Prescription.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      }),

      Prescription.countDocuments({
        status: "Issued",
      }),

      Prescription.countDocuments({
        status: "Dispensed",
      }),

      Medicine.countDocuments(),
    ]);

    const recentPrescriptions = await Prescription.find()
      .populate("patient", "patientId fullName")
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedPrescriptions = recentPrescriptions.map((prescription) => ({
      prescriptionId: prescription._id,
      patient: {
        patientId: prescription.patient?.patientId,
        fullName: prescription.patient?.fullName,
      },
      doctor: prescription.doctor?.user?.fullName,
      diagnosis: prescription.diagnosis,
      status: prescription.status,
      issuedOn: prescription.createdAt,
    }));

    return res.status(200).json({
      success: true,
      summary: {
        todayPrescriptions,
        pendingPrescriptions,
        dispensedPrescriptions,
        totalMedicines,
      },
      recentPrescriptions: formattedPrescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};