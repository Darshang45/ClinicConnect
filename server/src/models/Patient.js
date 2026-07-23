import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    patientId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+","A-","B+","B-",
        "AB+","AB-","O+","O-"
      ],
    },

    address: {
      type: String,
      trim: true,
    },

    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },

    allergies: [
      {
        type: String,
      }
    ],

    chronicDiseases: [
      {
        type: String,
      }
    ],

    insurance: {
      provider: String,
      policyNumber: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema);