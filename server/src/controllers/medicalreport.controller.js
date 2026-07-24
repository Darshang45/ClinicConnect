import mongoose from "mongoose";

import MedicalReport from "../models/MedicalReport.js";
import Appointment from "../models/Appointment.js";

import { validateMedicalReport } from "../validators/medicalReport.validator.js";

import Patient from "../models/Patient.js";

export const createMedicalReport = async (req, res) => {
  try {
    const validation = validateMedicalReport(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      appointment,
      reportType,
      title,
      findings,
      remarks,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointment)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment id.",
      });
    }

    const appointmentExists = await Appointment.findById(appointment);

    if (!appointmentExists) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointmentExists.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Medical report can only be created after completed appointment.",
      });
    }

    const report = await MedicalReport.create({
      appointment,
      patient: appointmentExists.patient,
      doctor: appointmentExists.doctor,
      reportType,
      title,
      findings,
      remarks,
      reportFile: req.file ? req.file.path : "",
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Medical report created successfully.",
      report,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getAllMedicalReports = async (req, res) => {
  try {

    const reports = await MedicalReport.find()
      .populate("appointment")
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getMedicalReportById = async (req, res) => {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report id.",
      });
    }

    const report = await MedicalReport.findById(req.params.id)
      .populate("appointment")
      .populate("patient")
      .populate("doctor");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Medical report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const getReportsByPatient = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id.",
      });
    }

    const patientExists = await Patient.findById(req.params.patientId);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const reports = await MedicalReport.find({
      patient: req.params.patientId,
    })
      .populate("appointment")
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReportByAppointment = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment id.",
      });
    }

    const report = await MedicalReport.findOne({
      appointment: req.params.appointmentId,
    })
      .populate("appointment")
      .populate("patient")
      .populate("doctor");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Medical report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMedicalReport = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report id.",
      });
    }

    const report = await MedicalReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Medical report not found.",
      });
    }

    const {
      reportType,
      title,
      findings,
      remarks,
      status,
    } = req.body;

    if (reportType) report.reportType = reportType;

    if (title) report.title = title;

    if (findings !== undefined) report.findings = findings;

    if (remarks !== undefined) report.remarks = remarks;

    if (status) report.status = status;

    if (req.file) {
      report.reportFile = req.file.path;
    }

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Medical report updated successfully.",
      report,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const deleteMedicalReport = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report id.",
      });
    }

    const report = await MedicalReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Medical report not found.",
      });
    }

    await MedicalReport.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Medical report deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};