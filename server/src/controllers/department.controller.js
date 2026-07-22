import Department from "../models/Department.js";
import { validateDepartment } from "../validators/department.validator.js";
//Create department

export const createDepartment = async (req, res) => {
  try {
    const validation = validateDepartment(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      name,
      code,
      description,
      consultationDuration,
      consultationFee,
    } = req.body;

    const existingDepartment = await Department.findOne({
      $or: [
        { name: name.trim() },
        { code: code.trim().toUpperCase() },
      ],
    });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Department already exists.",
      });
    }

    const department = await Department.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description,
      consultationDuration,
      consultationFee,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      department,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Departments

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      total: departments.length,
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single department

export const getDepartmentById = async (req, res) => {

    try {

        const department =
            await Department.findById(req.params.id);

        if (!department) {

            return res.status(404).json({

                success: false,

                message: "Department not found."

            });

        }

        res.status(200).json({

            success: true,

            department

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

//Update department

export const updateDepartment = async (req, res) => {

    try {

        const department =
            await Department.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true,
                }

            );

        if (!department) {

            return res.status(404).json({

                success: false,

                message: "Department not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Department updated.",

            department

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

//delete department

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    department.isActive = false;

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department deactivated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Search Department

export const searchDepartments = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const departments = await Department.find({
      isActive: true,
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

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

//Enable a department

export const toggleDepartmentStatus = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    department.isActive = !department.isActive;

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department status updated.",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};