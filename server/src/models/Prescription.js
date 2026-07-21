import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },

    medicines: [
      {
        medicineName: String,

        dosage: String,

        frequency: String,

        duration: String,
      },
    ],

    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Prescription",
  prescriptionSchema
);