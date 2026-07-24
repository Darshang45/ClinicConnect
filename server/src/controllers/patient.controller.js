import Patient from "../models/Patient.js";
import { validatePatient } from "../validators/patient.validator.js";

//Patient ID generator

const generatePatientId = async () => {
  const lastPatient = await Patient.findOne().sort({ createdAt: -1 });

  if (!lastPatient) {
    return "PAT000001";
  }

  const lastId = parseInt(lastPatient.patientId.substring(3));

  const newId = lastId + 1;

  return `PAT${String(newId).padStart(6, "0")}`;
};


//Create Patient 


export const createPatient = async (req, res) => {
  try {
    // Validate request
    const validation = validatePatient(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicDiseases,
      insurance,
    } = req.body;

    // Check duplicate phone
    const phoneExists = await Patient.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // Check duplicate email
    if (email) {
      const emailExists = await Patient.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // Generate Patient ID
    const patientId = await generatePatientId();

    // Create patient
    const patient = await Patient.create({
      patientId,
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicDiseases,
      insurance,
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully.",
      patient,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//Get all Patients 

export const getPatients = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      isActive: true,
      fullName: {
        $regex: search,
        $options: "i",
      },
    };

    const totalPatients = await Patient.countDocuments(query);

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalPatients,
      currentPage: page,
      totalPages: Math.ceil(totalPatients / limit),
      patients,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get Patient by ID

export const getPatientById = async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//Update Patient 

export const updatePatient = async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    Object.assign(patient, req.body);

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


//Soft delete patient

export const deletePatient = async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.isActive = false;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient deactivated successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Search Patient by Phone NO.

export const getPatientByPhone = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      phone: req.params.phone,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


//Search Patient

export const searchPatients = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || "";

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required.",
      });
    }

    const patients = await Patient.find({
      isActive: true,
      $or: [
        {
          patientId: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "patientId fullName phone gender bloodGroup dateOfBirth"
      )
      .sort({ fullName: 1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};