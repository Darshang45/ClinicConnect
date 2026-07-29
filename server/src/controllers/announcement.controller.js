import Announcement from "../models/Announcement.js";
import { createNotification } from "./notification.controller.js";

// ==========================================
// Create Announcement
// ==========================================

export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      createdBy,
      targetAudience,
      dashboardAlert,
      department,
      priority,
      startDate,
      expiryDate,
    } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      createdBy,
      targetAudience,
      dashboardAlert,
      department,
      priority,
      startDate,
      expiryDate,
    });

    // ==========================================
    // Create Notification
    // ==========================================

    if (announcement.dashboardAlert) {
      let receiverRole;

      switch (announcement.targetAudience) {
        case "Doctors":
          receiverRole = "doctor";
          break;

        case "Patients":
          receiverRole = "patient";
          break;

        default:
          receiverRole = "all";
      }

      await createNotification({
        title: announcement.title,
        message: announcement.message,
        sender: announcement.createdBy,
        receiverRole,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Announcements
// ==========================================

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "fullName email role")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Announcement By Id
// ==========================================

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("createdBy", "fullName email role")
      .populate("department", "name");

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Announcement
// ==========================================

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Delete Announcement
// ==========================================

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    await announcement.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
