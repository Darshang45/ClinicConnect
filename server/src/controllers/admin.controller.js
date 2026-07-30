import Admin from "../models/Admin.js";
import User from "../models/User.js";
import { validateAdmin } from "../validators/admin.validator.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import Appointment from "../models/Appointment.js";



export const createAdmin = async (req, res) => {
  try {
    const validation = validateAdmin(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const { user, employeeId, designation, profilePhoto } = req.body;

    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (existingUser.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an admin.",
      });
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ user }, { employeeId }],
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const admin = await Admin.create({
      user,
      employeeId,
      designation,
      profilePhoto,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({
      isActive: true,
    })
      .populate("user", "fullName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: admins.length,
      admins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate(
      "user",
      "fullName email phone role",
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    const { employeeId, designation, profilePhoto, isActive } = req.body;

    if (employeeId && employeeId !== admin.employeeId) {
      const existing = await Admin.findOne({
        employeeId,
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Employee ID already exists.",
        });
      }

      admin.employeeId = employeeId;
    }

    if (designation !== undefined) admin.designation = designation;

    if (profilePhoto !== undefined) admin.profilePhoto = profilePhoto;

    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully.",
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    admin.isActive = false;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardOverview = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      totalDoctors,
      totalDepartments,
      totalReceptionists,
      totalPharmacists,
      appointmentsToday,
    ] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isActive: true }),
      Department.countDocuments({ isActive: true }),
      User.countDocuments({
        role: "receptionist",
        isActive: true,
      }),
      User.countDocuments({
        role: "pharmacist",
        isActive: true,
      }),
      Appointment.countDocuments({
        appointmentStart: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      overview: {
        patients: totalPatients,
        doctors: totalDoctors,
        departments: totalDepartments,
        receptionists: totalReceptionists,
        pharmacists: totalPharmacists,
        appointmentsToday,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAppointmentStatistics = async (req, res) => {
  try {

    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const statistics = {
      Scheduled: 0,
      "Checked-In": 0,
      "In Consultation": 0,
      Completed: 0,
      Cancelled: 0,
    };

    stats.forEach((item) => {
      statistics[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      statistics,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const getRecentAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("patient", "fullName")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate("department", "name");

    const recentAppointments = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      tokenNumber: appointment.tokenNumber,
      patient: appointment.patient?.fullName,
      doctor: appointment.doctor?.user?.fullName,
      department: appointment.department?.name,
      appointmentTime: appointment.appointmentStart,
      status: appointment.status,
    }));

    return res.status(200).json({
      success: true,
      count: recentAppointments.length,
      appointments: recentAppointments,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const getDepartmentStatistics = async (req, res) => {
  try {

    const statistics = await Appointment.aggregate([
      {
        $group: {
          _id: "$department",
          appointments: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $project: {
          _id: 0,
          department: "$department.name",
          appointments: 1,
        },
      },
      {
        $sort: {
          appointments: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      departments: statistics,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getDoctorStatistics = async (req, res) => {
  try {

    const statistics = await Appointment.aggregate([
      {
        $group: {
          _id: {
            doctor: "$doctor",
            status: "$status",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id.doctor",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $lookup: {
          from: "users",
          localField: "doctor.user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "departments",
          localField: "doctor.department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
    ]);

    const doctorMap = {};

    statistics.forEach((item) => {

      const doctorId = item.doctor._id.toString();

      if (!doctorMap[doctorId]) {
        doctorMap[doctorId] = {
          doctor: item.user.fullName,
          department: item.department.name,
          totalAppointments: 0,
          completed: 0,
          pending: 0,
        };
      }

      doctorMap[doctorId].totalAppointments += item.count;

      if (item._id.status === "Completed") {
        doctorMap[doctorId].completed += item.count;
      } else if (
        [
          "Scheduled",
          "Checked-In",
          "In Consultation",
        ].includes(item._id.status)
      ) {
        doctorMap[doctorId].pending += item.count;
      }

    });

    return res.status(200).json({
      success: true,
      doctors: Object.values(doctorMap),
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getTodayDashboard = async (req, res) => {
  try {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const today = {
      appointments: appointments.length,
      scheduled: 0,
      checkedIn: 0,
      inConsultation: 0,
      completed: 0,
      cancelled: 0,
    };

    appointments.forEach((appointment) => {
      switch (appointment.status) {

        case "Scheduled":
          today.scheduled++;
          break;

        case "Checked-In":
          today.checkedIn++;
          break;

        case "In Consultation":
          today.inConsultation++;
          break;

        case "Completed":
          today.completed++;
          break;

        case "Cancelled":
          today.cancelled++;
          break;

      }
    });

    return res.status(200).json({
      success: true,
      today,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const getAdminDashboard = async (req, res) => {
  try {

    const totalDoctors = await Doctor.countDocuments({
      isActive: true,
    });

    const totalPatients = await Patient.countDocuments({
      isActive: true,
    });

    const totalReceptionists = await Receptionist.countDocuments({
      isActive: true,
    });

    const totalPharmacists = await Pharmacist.countDocuments({
      isActive: true,
    });

    const activeDepartments = await Department.countDocuments({
      isActive: true,
    });

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

    const completedAppointments =
      await Appointment.countDocuments({
        status: "Completed",
      });

    const cancelledAppointments =
      await Appointment.countDocuments({
        status: "Cancelled",
      });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalDoctors,
        totalPatients,
        totalReceptionists,
        totalPharmacists,
        activeDepartments,
        todayAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const getRecentDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find({
      isActive: true,
    })
      .populate("user", "fullName email phone")
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const data = doctors.map((doctor) => ({
      doctorId: doctor._id,
      name: doctor.user.fullName,
      email: doctor.user.email,
      phone: doctor.user.phone,
      department: doctor.department.name,
      specialization: doctor.specialization,
      consultationFee: doctor.consultationFee,
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



export const getRecentPatients = async (req, res) => {
  try {

    const patients = await Patient.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const data = patients.map((patient) => ({
      patientId: patient.patientId,
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      patients: data,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
