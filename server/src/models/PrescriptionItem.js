import mongoose from "mongoose";

const prescriptionItemSchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    instructions: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PrescriptionItem",
  prescriptionItemSchema
);