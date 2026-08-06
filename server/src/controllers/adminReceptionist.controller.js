import User from "../models/User.js";
import { logActivity } from "../utils/activityLogger.js";
import { paginateQuery } from "../utils/paginate.js";
import { createCaseInsensitiveSearchRegex } from "../utils/search.js";

export const createReceptionist = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists.",
      });
    }

    const receptionist = await User.create({
      fullName,
      email,
      phone,
      password,
      role: "receptionist",
    });

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "ADD_RECEPTIONIST",
      module: "Receptionist",
      description: `Added Receptionist ${receptionist.fullName}`,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Receptionist created successfully.",
      receptionistId: receptionist._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReceptionists = async (req, res) => {
  try {
    const filter = {
      role: "receptionist",
      isActive: true,
    };
    const searchRegex = createCaseInsensitiveSearchRegex(req.query.search);

    if (searchRegex) {
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const response = await paginateQuery({
      model: User,
      filter,
      query: User.find(filter).select("-password").sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Receptionists retrieved successfully.",
      legacy: { dataKey: "receptionists", totalKey: "count" },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReceptionistById = async (req, res) => {
  try {
    const receptionist = await User.findOne({
      _id: req.params.id,
      role: "receptionist",
    }).select("-password");

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    return res.status(200).json({
      success: true,
      receptionist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReceptionist = async (req, res) => {
  try {
    const receptionist = await User.findOne({
      _id: req.params.id,
      role: "receptionist",
      isActive: true,
    });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    const { fullName, email, phone, password } = req.body;

    // Check duplicate email
    if (email && email !== receptionist.email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      receptionist.email = email;
    }

    // Check duplicate phone
    if (phone && phone !== receptionist.phone) {
      const existingPhone = await User.findOne({ phone });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists.",
        });
      }

      receptionist.phone = phone;
    }

    if (fullName) receptionist.fullName = fullName;

    if (password) receptionist.password = password;

    await receptionist.save();

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "UPDATE_RECEPTIONIST",
      module: "Receptionist",
      description: `Updated Receptionist ${receptionist.fullName}`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Receptionist updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReceptionist = async (req, res) => {
  try {
    const receptionist = await User.findOne({
      _id: req.params.id,
      role: "receptionist",
      isActive: true,
    });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    receptionist.isActive = false;

    await receptionist.save();

    await logActivity({
      user: req.user._id,
      role: req.user.role,
      action: "DELETE_RECEPTIONIST",
      module: "Receptionist",
      description: `Deleted Receptionist ${receptionist.fullName}`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Receptionist deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
