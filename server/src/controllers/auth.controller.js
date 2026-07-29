import User from "../models/User.js";
import generateToken from "../utils/generateTokens.js";
import Patient from "../models/Patient.js";
import Otp from "../models/Otp.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";


// // =========================
// // Register
// // =========================
// export const register = async (req, res) => {

//   try {

//     const {
//       fullName,
//       email,
//       phone,
//       password,
//       role,
//     } = req.body;

//     // Validation

//     if (
//       !fullName ||
//       !email ||
//       !phone ||
//       !password ||
//       !role
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all fields",
//       });
//     }

//     // Check existing user

//     const existingUser = await User.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Create user

//     const user = await User.create({
//       fullName,
//       email,
//       phone,
//       password,
//       role,
//     });

//     // Generate JWT

//     const token = generateToken(user._id, user.role);

//     res.status(201).json({
//       success: true,
//       message: "Registration Successful",
//       token,
//       user,
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });

//   }

// };


// =========================
// Login
// =========================
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email,
      isActive: true,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(
      user._id,
      user.role
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getCurrentUser = async (req, res) => {

  try {

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        isActive: req.user.isActive,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    const user = await User.findById(req.user._id)
      .select("+password");

    const isMatch = await user.matchPassword(
      currentPassword
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const sendPatientOtp = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const patient = await Patient.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Remove previous OTPs
    await Otp.deleteMany({
      email: email.toLowerCase(),
    });

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save OTP (will be hashed automatically by the model)
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Email Template
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Clinic Connect Login OTP</h2>

        <p>Hello <strong>${patient.fullName}</strong>,</p>

        <p>Your OTP for login is:</p>

        <h1 style="letter-spacing: 6px;">${otp}</h1>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(
      patient.email,
      "Clinic Connect - Login OTP",
      html
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const verifyPatientOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const otpRecord = await Otp.findOne({
      email: email.toLowerCase(),
    });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found.",
      });
    }

    if (otpRecord.expiresAt < new Date()) {

      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });

    }

    const isValid = await otpRecord.matchOtp(otp);

    if (!isValid) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });

    }

    const patient = await Patient.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!patient) {

      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });

    }

    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const resendPatientOtp = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const patient = await Patient.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const existingOtp = await Otp.findOne({
      email: email.toLowerCase(),
    });

    // 60-second cooldown
    if (existingOtp) {
      const secondsPassed =
        (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;

      if (secondsPassed < 60) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(
            60 - secondsPassed
          )} seconds before requesting another OTP.`,
        });
      }

      await Otp.deleteOne({ _id: existingOtp._id });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Clinic Connect</h2>

        <p>Hello <strong>${patient.fullName}</strong>,</p>

        <p>Your new OTP is:</p>

        <h1 style="letter-spacing:5px;">${otp}</h1>

        <p>Valid for 5 minutes.</p>
      </div>
    `;

    await sendEmail(
      patient.email,
      "Clinic Connect - Resend OTP",
      html
    );

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};