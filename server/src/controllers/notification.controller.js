import Notification from "../models/Notification.js";

// ======================================================
// Internal Helper Function
// ======================================================

export const createNotification = async ({
  title,
  message,
  sender = null,
  receiver = null,
  receiverRole = null,
}) => {
  try {
    return await Notification.create({
      title,
      message,
      sender,
      receiver,
      receiverRole,
    });
  } catch (error) {
    console.error("Notification Error:", error.message);
  }
};

// ======================================================
// Get All Notifications
// ======================================================

export const getNotifications = async (req, res) => {
  try {

    const userId = req.params.userId;

    const notifications = await Notification.find({
      $or: [
        { receiver: userId },
        { receiverRole: req.query.role },
        { receiverRole: "all" },
      ],
    })
      .populate("sender", "fullName role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// Get Unread Notifications
// ======================================================

export const getUnreadNotifications = async (req, res) => {
  try {

    const userId = req.params.userId;

    const notifications = await Notification.find({
      isRead: false,
      $or: [
        { receiver: userId },
        { receiverRole: req.query.role },
        { receiverRole: "all" },
      ],
    })
      .populate("sender", "fullName role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// Mark One Notification As Read
// ======================================================

export const markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// Mark All Notifications As Read
// ======================================================

export const markAllAsRead = async (req, res) => {
  try {

    const userId = req.params.userId;

    await Notification.updateMany(
      {
        isRead: false,
        $or: [
          { receiver: userId },
          { receiverRole: req.query.role },
          { receiverRole: "all" },
        ],
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// Delete Notification
// ======================================================

export const deleteNotification = async (req, res) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};