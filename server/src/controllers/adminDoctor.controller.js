import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import { logActivity } from "../utils/activityLogger.js";
import { paginateQuery } from "../utils/paginate.js";
import { createCaseInsensitiveSearchRegex } from "../utils/search.js";

export const createDoctorByAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      bio,
      profilePhoto,
    } = req.body;

    // Check email

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Check phone

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists.",
      });
    }

    // Check department

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    // Check license

    const existingDoctor = await Doctor.findOne({
      licenseNumber,
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "License number already exists.",
      });
    }

    // Create user

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: "doctor",
    });

    // Create doctor

    const doctor = await Doctor.create({
      user: user._id,
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      licenseNumber,
      bio,
      profilePhoto,
    });

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "ADD_DOCTOR",
      module: "Doctor",
      description: `Added Doctor ${user.fullName}`,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully.",
      doctorId: doctor._id,
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorsByAdmin = async (req, res) => {
  try {
    const filter = { isActive: true };
    const searchRegex = createCaseInsensitiveSearchRegex(req.query.search);

    if (req.query.department) {
      filter.department = req.query.department;
    }

    if (searchRegex) {
      const matchingUserIds = await User.find({
        role: "doctor",
        $or: [
          { fullName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      }).distinct("_id");

      filter.$or = [
        { user: { $in: matchingUserIds } },
        { specialization: searchRegex },
      ];
    }

    const response = await paginateQuery({
      model: Doctor,
      filter,
      query: Doctor.find(filter)
        .populate("user", "fullName email phone isActive")
        .populate("department", "name code")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Doctors retrieved successfully.",
      legacy: { dataKey: "doctors", totalKey: "count" },
    });

    response.data = response.data.map((doctor) => ({
      doctorId: doctor._id,
      fullName: doctor.user.fullName,
      email: doctor.user.email,
      phone: doctor.user.phone,
      department: doctor.department.name,
      departmentId: doctor.department._id,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      qualification: doctor.qualification,
      licenseNumber: doctor.licenseNumber,
      bio: doctor.bio,
      profilePhoto: doctor.profilePhoto,
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

export const getDoctorByIdByAdmin = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "fullName email phone isActive")
      .populate("department", "name code");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      doctor: {
        doctorId: doctor._id,
        fullName: doctor.user.fullName,
        email: doctor.user.email,
        phone: doctor.user.phone,
        department: doctor.department.name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        licenseNumber: doctor.licenseNumber,
        bio: doctor.bio,
        profilePhoto: doctor.profilePhoto,
        isAvailable: doctor.isAvailable,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDoctorByAdmin = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const user = await User.findById(doctor.user);

    const {
      fullName,
      email,
      phone,
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

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const existingPhone = await User.findOne({ phone });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists.",
        });
      }

      user.phone = phone;
    }

    if (fullName) user.fullName = fullName;

    await user.save();

    if (department) doctor.department = department;
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (bio !== undefined) doctor.bio = bio;
    if (profilePhoto !== undefined) doctor.profilePhoto = profilePhoto;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

    await doctor.save();
    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "UPDATE_DOCTOR",
      module: "Doctor",
      description: `Updated Doctor ${user.fullName}`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDoctorByAdmin = async (req, res) => {
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

    await User.findByIdAndUpdate(doctor.user, {
      isActive: false,
    });

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "DELETE_DOCTOR",
      module: "Doctor",
      description: `Deleted Doctor ${doctor._id}`,
      ipAddress: req.ip,
    });

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
