import User from "../models/User.js";


export const createPharmacist = async (req, res) => {
  try {

    const {
      fullName,
      email,
      phone,
      password,
    } = req.body;

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

    const pharmacist = await User.create({
      fullName,
      email,
      phone,
      password,
      role: "pharmacist",
    });

    return res.status(201).json({
      success: true,
      message: "Pharmacist created successfully.",
      pharmacistId: pharmacist._id,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getPharmacists = async (req, res) => {
  try {

    const pharmacists = await User.find({
      role: "pharmacist",
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pharmacists.length,
      pharmacists,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getPharmacistById = async (req, res) => {
  try {

    const pharmacist = await User.findOne({
      _id: req.params.id,
      role: "pharmacist",
    }).select("-password");

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: "Pharmacist not found.",
      });
    }

    return res.status(200).json({
      success: true,
      pharmacist,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const updatePharmacist = async (req, res) => {
  try {

    const pharmacist = await User.findOne({
      _id: req.params.id,
      role: "pharmacist",
      isActive: true,
    });

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: "Pharmacist not found.",
      });
    }

    const {
      fullName,
      email,
      phone,
      password,
    } = req.body;

    if (email && email !== pharmacist.email) {

      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      pharmacist.email = email;
    }

    if (phone && phone !== pharmacist.phone) {

      const existingPhone = await User.findOne({ phone });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists.",
        });
      }

      pharmacist.phone = phone;
    }

    if (fullName) pharmacist.fullName = fullName;

    if (password) pharmacist.password = password;

    await pharmacist.save();

    return res.status(200).json({
      success: true,
      message: "Pharmacist updated successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const deletePharmacist = async (req, res) => {
  try {

    const pharmacist = await User.findOne({
      _id: req.params.id,
      role: "pharmacist",
      isActive: true,
    });

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: "Pharmacist not found.",
      });
    }

    pharmacist.isActive = false;

    await pharmacist.save();

    return res.status(200).json({
      success: true,
      message: "Pharmacist deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};