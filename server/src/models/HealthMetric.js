import mongoose from "mongoose";

const healthMetricSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    height: {
      type: Number,
      min: 0,
      default: null,
    },

    weight: {
      type: Number,
      min: 0,
      default: null,
    },

    bmi: {
      type: Number,
      default: null,
    },

    bloodPressure: {
      type: String,
      trim: true,
      default: "",
    },

    heartRate: {
      type: Number,
      min: 0,
      default: null,
    },

    bloodSugar: {
      type: Number,
      min: 0,
      default: null,
    },

    oxygenLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    temperature: {
      type: Number,
      min: 0,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },

    recordedBy: {
      type: String,
      enum: ["Patient", "Doctor", "Receptionist"],
      default: "Patient",
    },
  },
  {
    timestamps: true,
  }
);

healthMetricSchema.index({ patient: 1, recordedAt: -1 });

export default mongoose.model("HealthMetric", healthMetricSchema);
