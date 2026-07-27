import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";


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

    const doctors = await Doctor.find({ isActive: true })
      .populate("user", "fullName email phone isActive")
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    const response = doctors.map((doctor) => ({
      doctorId: doctor._id,
      fullName: doctor.user.fullName,
      email: doctor.user.email,
      phone: doctor.user.phone,
      department: doctor.department.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      isAvailable: doctor.isAvailable,
    }));

    return res.status(200).json({
      success: true,
      count: response.length,
      doctors: response,
    });

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
      .populate("user", "fullName email phone")
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
      isAvailable,
    } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    if (department) doctor.department = department;
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined)
      doctor.consultationFee = consultationFee;
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (bio !== undefined) doctor.bio = bio;
    if (isAvailable !== undefined)
      doctor.isAvailable = isAvailable;

    await doctor.save();

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

    await User.findByIdAndUpdate(
      doctor.user,
      {
        isActive: false,
      }
    );

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