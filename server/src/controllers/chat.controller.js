import mongoose from "mongoose";

import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";

/* ===========================================================
   Helper Functions
=========================================================== */

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/* ===========================================================
   Permission Validation
=========================================================== */

const validateChatPermission = async (
  currentUserId,
  participantId
) => {
  const currentUser = await User.findById(currentUserId);

  const participant = await User.findById(participantId);

  if (!currentUser || !participant) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  /* ===========================================
     Patient
  =========================================== */

  if (currentUser.role === "patient") {

    if (participant.role !== "doctor") {
      return {
        success: false,
        status: 403,
        message:
          "Patients can only chat with doctors.",
      };
    }

    const patient = await Patient.findOne({
      user: currentUserId,
    });

    const doctor = await Doctor.findOne({
      user: participantId,
    });

    if (!patient || !doctor) {
      return {
        success: false,
        status: 404,
        message: "Doctor or Patient not found.",
      };
    }

    const appointment = await Appointment.findOne({
      patient: patient._id,
      doctor: doctor._id,
    });

    if (!appointment) {
      return {
        success: false,
        status: 403,
        message:
          "You can only chat with doctors you have consulted.",
      };
    }

  }

  /* ===========================================
     Receptionist
  =========================================== */

  if (
    currentUser.role === "receptionist" &&
    participant.role === "patient"
  ) {
    return {
      success: false,
      status: 403,
      message:
        "Receptionists cannot chat with patients.",
    };
  }

  /* ===========================================
     Pharmacist
  =========================================== */

  if (
    currentUser.role === "pharmacist" &&
    participant.role === "patient"
  ) {
    return {
      success: false,
      status: 403,
      message:
        "Pharmacists cannot chat with patients.",
    };
  }

  return {
    success: true,
    currentUser,
    participant,
  };
};

/* ===========================================================
   Create Chat
=========================================================== */

export const createChat = async (req, res) => {
  try {

    const { participantId } = req.body;

    const currentUserId = req.user.id;

    if (!isValidObjectId(participantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid participant id.",
      });
    }

    if (participantId === currentUserId) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot create a chat with yourself.",
      });
    }

    const permission =
      await validateChatPermission(
        currentUserId,
        participantId
      );

    if (!permission.success) {
      return res.status(permission.status).json({
        success: false,
        message: permission.message,
      });
    }

    let chat = await Chat.findOne({
      type: "Direct",
      participants: {
        $all: [currentUserId, participantId],
      },
    })
      .populate(
        "participants",
        "-password"
      )
      .populate(
        "lastMessage"
      );

    if (chat) {
      return res.status(200).json({
        success: true,
        message:
          "Conversation already exists.",
        chat,
      });
    }

    chat = await Chat.create({
      participants: [
        currentUserId,
        participantId,
      ],
      createdBy: currentUserId,
      type: "Direct",
    });

    chat = await Chat.findById(chat._id)
      .populate(
        "participants",
        "-password"
      )
      .populate(
        "lastMessage"
      );

    return res.status(201).json({
      success: true,
      message:
        "Conversation created successfully.",
      chat,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to create conversation.",
    });

  }
};

/* ===========================================================
   Get Available Users
=========================================================== */

export const getAvailableUsers = async (
  req,
  res
) => {
  try {

    const currentUser =
      await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let users = [];

    /* =======================================
       Patient
    ======================================= */

    if (currentUser.role === "patient") {

      const patient = await Patient.findOne({
        user: currentUser._id,
      });

      const appointments =
        await Appointment.find({
          patient: patient._id,
        }).populate({
          path: "doctor",
          populate: {
            path: "user",
            model: "User",
          },
        });

      const doctorIds = [
        ...new Set(
          appointments.map((appointment) =>
            appointment.doctor.user._id.toString()
          )
        ),
      ];

      users = await User.find({
        _id: {
          $in: doctorIds,
        },
      }).select(
        "fullName email role"
      );

    }

    /* =======================================
       Doctor
    ======================================= */

    else if (currentUser.role === "doctor") {

      users = await User.find({
        _id: {
          $ne: currentUser._id,
        },
      }).select(
        "fullName email role"
      );

    }

    /* =======================================
       Receptionist
    ======================================= */

    else if (
      currentUser.role ===
      "receptionist"
    ) {

      users = await User.find({
        _id: {
          $ne: currentUser._id,
        },
        role: {
          $ne: "patient",
        },
      }).select(
        "fullName email role"
      );

    }

    /* =======================================
       Pharmacist
    ======================================= */

    else if (
      currentUser.role ===
      "pharmacist"
    ) {

      users = await User.find({
        _id: {
          $ne: currentUser._id,
        },
        role: {
          $ne: "patient",
        },
      }).select(
        "fullName email role"
      );

    }

    /* =======================================
       Admin
    ======================================= */

    else {

      users = await User.find({
        _id: {
          $ne: currentUser._id,
        },
      }).select(
        "fullName email role"
      );

    }

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch users.",
    });

  }
};

/* ===========================================================
   Get User Chats
=========================================================== */

export const getChats = async (req, res) => {
  try {

    const currentUserId = req.user.id;

    const chats = await Chat.find({
      participants: currentUserId,
      deletedFor: {
        $ne: currentUserId,
      },
    })
      .populate(
        "participants",
        "fullName email role"
      )
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "fullName role",
        },
      })
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      });

    const chatList = await Promise.all(
      chats.map(async (chat) => {

        const unreadCount =
          await Message.countDocuments({
            chat: chat._id,
            receiver: currentUserId,
            status: {
              $ne: "seen",
            },
            deletedFor: {
              $ne: currentUserId,
            },
          });

        return {
          ...chat.toObject(),
          unreadCount,
        };

      })
    );

    return res.status(200).json({
      success: true,
      chats: chatList,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch conversations.",
    });

  }
};

/* ===========================================================
   Search Chats
=========================================================== */

export const searchChats = async (req, res) => {

  try {

    const keyword =
      req.query.search?.trim() || "";

    const chats = await Chat.find({
      participants: req.user.id,
    }).populate(
      "participants",
      "fullName email role"
    );

    const filteredChats = chats.filter(
      (chat) =>

        chat.participants.some(
          (participant) =>
            participant._id.toString() !==
              req.user.id &&
            (
              participant.fullName
                .toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||

              participant.role
                .toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||

              participant.email
                .toLowerCase()
                .includes(
                  keyword.toLowerCase()
                )
            )
        )
    );

    return res.status(200).json({
      success: true,
      chats: filteredChats,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to search conversations.",
    });

  }

};

/* ===========================================================
   Get Messages
=========================================================== */

export const getMessages = async (
  req,
  res
) => {

  try {

    const { chatId } = req.params;

    if (!isValidObjectId(chatId)) {

      return res.status(400).json({
        success: false,
        message: "Invalid chat id.",
      });

    }

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 50;

    const skip =
      (page - 1) * limit;

    const chat =
      await Chat.findById(chatId);

    if (!chat) {

      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });

    }

    if (
      !chat.participants.some(
        (participant) =>
          participant.toString() ===
          req.user.id
      )
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });

    }

    const totalMessages =
      await Message.countDocuments({
        chat: chatId,
        deletedFor: {
          $ne: req.user.id,
        },
      });

    const messages =
      await Message.find({
        chat: chatId,
        deletedFor: {
          $ne: req.user.id,
        },
      })
        .populate(
          "sender",
          "fullName role"
        )
        .populate(
          "receiver",
          "fullName role"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({

      success: true,

      totalMessages,

      currentPage: page,

      totalPages: Math.ceil(
        totalMessages / limit
      ),

      messages: messages.reverse(),

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch messages.",

    });

  }

};
/* ===========================================================
   Send Message
=========================================================== */

export const sendMessage = async (req, res) => {
  try {

    const { chatId } = req.params;

    const {
      message = "",
      messageType = "text",
    } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (
      !chat.participants.some(
        (participant) =>
          participant.toString() === req.user.id
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const receiver = chat.participants.find(
      (participant) =>
        participant.toString() !== req.user.id
    );

    const attachment = req.file
      ? {
          url: req.file.path,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
        }
      : {
          url: "",
          fileName: "",
          mimeType: "",
          fileSize: 0,
        };

    if (
      !message.trim() &&
      !attachment.url
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Message or attachment is required.",
      });
    }

    const newMessage = await Message.create({
      chat: chatId,
      sender: req.user.id,
      receiver,
      message,
      messageType,
      attachment,
      status: "sent",
    });

    chat.lastMessage = newMessage._id;
    chat.lastMessageSender = req.user.id;
    chat.lastMessageAt = new Date();

    await chat.save();

    const populatedMessage =
      await Message.findById(newMessage._id)
        .populate("sender", "fullName role")
        .populate("receiver", "fullName role");

    /*
      Socket.IO

      io.to(chatId).emit(
        "receive-message",
        populatedMessage
      );

      io.to(receiver.toString()).emit(
        "new-notification",
        ...
      );
    */

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: populatedMessage,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });

  }
};

/* ===========================================================
   Edit Message
=========================================================== */

export const editMessage = async (
  req,
  res
) => {

  try {

    const { messageId } = req.params;

    const { message } = req.body;

    const existingMessage =
      await Message.findById(messageId);

    if (!existingMessage) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    if (
      existingMessage.sender.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });

    }

    existingMessage.message = message;

    existingMessage.isEdited = true;

    existingMessage.editedAt =
      new Date();

    await existingMessage.save();

    return res.status(200).json({

      success: true,

      message:
        "Message updated successfully.",

      data: existingMessage,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Unable to update message.",

    });

  }

};

/* ===========================================================
   Delete Message
=========================================================== */

export const deleteMessage = async (
  req,
  res
) => {

  try {

    const { messageId } = req.params;

    const message =
      await Message.findById(messageId);

    if (!message) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    if (
      message.sender.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });

    }

    if (
      !message.deletedFor.includes(
        req.user.id
      )
    ) {

      message.deletedFor.push(
        req.user.id
      );

      await message.save();

    }

    return res.status(200).json({

      success: true,

      message:
        "Message deleted successfully.",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Unable to delete message.",

    });

  }

};

/* ===========================================================
   Mark Messages Seen
=========================================================== */

export const markMessagesSeen = async (
  req,
  res
) => {

  try {

    const { chatId } = req.params;

    await Message.updateMany(
      {
        chat: chatId,
        receiver: req.user.id,
        status: {
          $ne: "seen",
        },
      },
      {
        status: "seen",
        seenAt: new Date(),
      }
    );

    /*
      Socket.IO

      io.to(chatId).emit(
        "messages-seen",
        {
          chatId,
          userId: req.user.id,
        }
      );
    */

    return res.status(200).json({

      success: true,

      message:
        "Messages marked as seen.",

    });

  } catch (error) {
  console.error("SEND MESSAGE ERROR");
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}

};