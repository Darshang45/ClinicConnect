import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },

    medicines: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },

        quantity: Number,

        price: Number,
      },
    ],

    totalAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Invoice", invoiceSchema);