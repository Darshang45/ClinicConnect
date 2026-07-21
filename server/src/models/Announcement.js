import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetAudience: {
      type: String,
      enum: [
        "Patients",
        "Doctors",
        "Receptionists",
        "Pharmacists",
        "Admins",
        "Everyone",
      ],
      default: "Everyone",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    priority: {
      type: String,
      enum: ["Low", "High", "Urgent"],
      default: "Medium",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
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

export default mongoose.model(
  "Announcement",
  announcementSchema
);