import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    appointmentStart: {
      type: Date,
      required: true,
    },

    appointmentEnd: {
      type: Date,
      required: true,
    },

    consultationDuration: {
      type: Number,
      default: 15,
    },

    consultationType: {
      type: String,
      enum: ["Offline", "Online"],
      default: "Offline",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    symptoms: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Checked-In",
        "In Consultation",
        "Completed",
        "Cancelled",
        "No Show",
      ],
      default: "Scheduled",
    },

    bookedBy: {
      type: String,
      enum: ["Patient", "Receptionist"],
      default: "Patient",
    },

    tokenNumber: {
      type: Number,
      default: null,
    },

    cancelledBy: {
      type: String,
      enum: ["Patient", "Doctor", "Receptionist", "Admin"],
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },

    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalReport",
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Appointment", appointmentSchema);