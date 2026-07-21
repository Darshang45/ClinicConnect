import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
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

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    reportType: {
      type: String,
      enum: [
        "Blood Test",
        "X-Ray",
        "MRI",
        "CT Scan",
        "Ultrasound",
        "Prescription",
        "Other",
      ],
    },

    reportName: {
      type: String,
      required: true,
    },

    reportUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: String,
      enum: ["Patient", "Doctor"],
    },

    remarks: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MedicalReport", medicalReportSchema);