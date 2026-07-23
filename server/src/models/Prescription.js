import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

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

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    followUpDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Draft", "Issued", "Dispensed"],
      default: "Issued",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Prescription", prescriptionSchema);