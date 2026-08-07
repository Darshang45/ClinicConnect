import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Available", "In Consultation", "Off Duty"],
      default: "Available",
    },

    roomNumber: {
      type: String,
      default: "101",
    },

    offDutyUntil: {
      type: Date,
      default: null,
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

doctorSchema.index({ department: 1, isActive: 1, isAvailable: 1 });
doctorSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.model("Doctor", doctorSchema);
