import mongoose from "mongoose";

const pharmacyOrderSchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
      unique: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    dispensingStatus: {
      type: String,
      enum: ["Pending", "Dispensed"],
      default: "Pending",
    },

    dispensedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

pharmacyOrderSchema.index({ patient: 1, createdAt: -1 });
pharmacyOrderSchema.index({ dispensingStatus: 1, createdAt: -1 });
pharmacyOrderSchema.index({ dispensingStatus: 1, dispensedAt: -1 });
pharmacyOrderSchema.index({ paymentStatus: 1, createdAt: -1 });
pharmacyOrderSchema.index({ createdAt: -1 });

export default mongoose.model("PharmacyOrder", pharmacyOrderSchema);
