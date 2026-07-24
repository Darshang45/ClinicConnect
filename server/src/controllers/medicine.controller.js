import Medicine from "../models/Medicine.js";
import { validateMedicine } from "../validators/medicine.validator.js";

export const createMedicine = async (req, res) => {
  try {
    const validation = validateMedicine(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      name,
      genericName,
      brand,
      category,
      strength,
      manufacturer,
      unit,
      price,
      requiresPrescription,
    } = req.body;

    const existingMedicine = await Medicine.findOne({
      name: name.trim(),
      strength: strength.trim(),
      manufacturer: manufacturer.trim(),
      isActive: true,
    });

    if (existingMedicine) {
      return res.status(409).json({
        success: false,
        message: "Medicine already exists.",
      });
    }

    const medicine = await Medicine.create({
      name: name.trim(),
      genericName: genericName.trim(),
      brand: brand.trim(),
      category,
      strength: strength.trim(),
      manufacturer: manufacturer.trim(),
      unit,
      price,
      requiresPrescription,
    });

    return res.status(201).json({
      success: true,
      message: "Medicine created successfully.",
      medicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      total: medicines.length,
      medicines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found.",
      });
    }

    return res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found.",
      });
    }

    Object.assign(medicine, req.body);

    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully.",
      medicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found.",
      });
    }

    medicine.isActive = false;

    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchMedicines = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const medicines = await Medicine.find({
      isActive: true,
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          genericName: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      medicines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMedicinesByCategory = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      category: req.params.category,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      total: medicines.length,
      medicines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};