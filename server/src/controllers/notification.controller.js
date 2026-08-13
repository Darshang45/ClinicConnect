import Notification from "../models/Notification.js";
import { paginateQuery } from "../utils/paginate.js";
import { getIO } from "../socket/socket.js";

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
    const notification = await Notification.create({
      title,
      message,
      sender,
      receiver,
      receiverRole,
    });

    const io = getIO();

    if (io) {
      if (receiver) {
        io.to(receiver.toString()).emit("new-notification", notification);
      } else if (receiverRole === "all") {
        io.to("notification:all").emit("new-notification", notification);
      } else if (receiverRole) {
        io.to(`notification:role:${receiverRole}`).emit("new-notification", notification);
      }
    }

    return notification;
  } catch (error) {
    console.error("Notification Error:", error.message);
  }
};

// ======================================================
// Get All Notifications
// ======================================================

export const getNotifications = async (req, res) => {
  try {

    const userId = req.user._id;
    const userRole = req.user.role;

    const filter = {
      $or: [
        { receiver: userId },
        { receiverRole: userRole },
        { receiverRole: "all" },
      ],
      deletedBy: { $ne: userId },
    };
    const response = await paginateQuery({
      model: Notification,
      filter,
      query: Notification.find(filter)
        .populate("sender", "fullName role")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Notifications retrieved successfully.",
      legacy: { dataKey: "notifications", totalKey: "count" },
    });

    response.data = response.data.map((doc) => {
      const isUserRead =
        doc.isRead ||
        (doc.readBy &&
          doc.readBy.some((id) => id.toString() === userId.toString()));

      return {
        ...doc,
        isRead: Boolean(isUserRead),
      };
    });

    return res.status(200).json(response);

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

    const userId = req.user._id;
    const userRole = req.user.role;

    const filter = {
      $or: [
        { receiver: userId },
        { receiverRole: userRole },
        { receiverRole: "all" },
      ],
      deletedBy: { $ne: userId },
      readBy: { $ne: userId },
      isRead: false,
    };
    const response = await paginateQuery({
      model: Notification,
      filter,
      query: Notification.find(filter)
        .populate("sender", "fullName role")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Unread notifications retrieved successfully.",
      legacy: { dataKey: "notifications", totalKey: "count" },
    });

    response.data = response.data.map((doc) => ({
      ...doc,
      isRead: false,
    }));

    return res.status(200).json(response);

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

    const userId = req.user._id.toString();
    const userRole = req.user.role;

    const isReceiver =
      notification.receiver && notification.receiver.toString() === userId;
    const isMatchingRole = notification.receiverRole === userRole;
    const isAllRole = notification.receiverRole === "all";

    if (!isReceiver && !isMatchingRole && !isAllRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user._id },
      ...(isReceiver ? { isRead: true } : {}),
    });

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

    const userId = req.user._id;
    const userRole = req.user.role;

    await Notification.updateMany(
      {
        $or: [
          { receiver: userId },
          { receiverRole: userRole },
          { receiverRole: "all" },
        ],
        deletedBy: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    await Notification.updateMany(
      {
        receiver: userId,
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

    const userId = req.user._id.toString();
    const userRole = req.user.role;

    const isReceiver =
      notification.receiver && notification.receiver.toString() === userId;
    const isMatchingRole = notification.receiverRole === userRole;
    const isAllRole = notification.receiverRole === "all";

    if (!isReceiver && !isMatchingRole && !isAllRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (isReceiver) {
      await notification.deleteOne();
    } else {
      await Notification.findByIdAndUpdate(req.params.id, {
        $addToSet: { deletedBy: req.user._id },
      });
    }

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
