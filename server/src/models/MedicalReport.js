import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
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

    reportType: {
      type: String,
      enum: [
        "Blood Test",
        "Urine Test",
        "X-Ray",
        "MRI",
        "CT Scan",
        "ECG",
        "Ultrasound",
        "Other",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    findings: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    reportFile: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

medicalReportSchema.index({ patient: 1, createdAt: -1 });
medicalReportSchema.index({ doctor: 1, createdAt: -1 });
medicalReportSchema.index({ appointment: 1 });
medicalReportSchema.index({ createdAt: -1 });

export default mongoose.model("MedicalReport", medicalReportSchema);
