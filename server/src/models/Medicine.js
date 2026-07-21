import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      unique: true,
    },

    manufacturer: String,

    category: String,

    unitPrice: {
      type: Number,
      required: true,
    },

    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Medicine", medicineSchema);