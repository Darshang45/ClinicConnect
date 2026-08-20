import mongoose from "mongoose";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";

export const getPublicDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select("_id name consultationFee consultationDuration")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublicDoctorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID.",
      });
    }

    const doctors = await Doctor.find({
      department: departmentId,
      isActive: true,
      isAvailable: true,
    })
      .select("_id specialization consultationFee profilePhoto user department")
      .populate("user", "fullName")
      .populate("department", "name");

    return res.status(200).json({
      success: true,
      doctors: doctors.map((doctor) => ({
        _id: doctor._id,
        specialization: doctor.specialization,
        consultationFee: doctor.consultationFee,
        profilePhoto: doctor.profilePhoto,
        user: {
          fullName: doctor.user?.fullName,
        },
        department: {
          _id: doctor.department?._id,
          name: doctor.department?.name,
        },
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
