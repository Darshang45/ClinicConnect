import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { validateDoctor } from "../validators/doctor.validator.js";

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
    if (consultationFee !== undefined)
      doctor.consultationFee = consultationFee;
    if (bio !== undefined) doctor.bio = bio;
    if (profilePhoto !== undefined)
      doctor.profilePhoto = profilePhoto;
    if (isAvailable !== undefined)
      doctor.isAvailable = isAvailable;

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