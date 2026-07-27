import mongoose from "mongoose";

const pharmacyOrderItemSchema = new mongoose.Schema(
  {
    pharmacyOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyOrder",
      required: true,
    },

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PharmacyOrderItem",
  pharmacyOrderItemSchema
);