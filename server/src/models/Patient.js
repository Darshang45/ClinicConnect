import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    bloodGroup: String,

    address: String,

    emergencyContact: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema);