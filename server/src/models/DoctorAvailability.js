import mongoose from "mongoose";

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    leaveType: {
      type: String,
      enum: [
        "Full Day",
        "Half Day",
        "Emergency Leave",
        "Vacation",
        "Holiday",
        "Other",
      ],
      default: "Full Day",
    },

    startTime: {
      type: String,
      default: "09:00 AM",
    },

    endTime: {
      type: String,
      default: "05:00 PM",
    },

    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);