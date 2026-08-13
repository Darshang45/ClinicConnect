import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { createNotification } from "./notification.controller.js";
import { getIO } from "../socket/socket.js";
import {
  authorizeChatForUser,
  canUsersChat,
  getAllowedChatTargets,
  isValidChatObjectId,
} from "../services/chatAuthorization.service.js";

const currentUserId = (req) => req.user._id.toString();

const chatAccessError = (res, result) =>
  res.status(result.status || 403).json({ success: false, message: result.message || "Access denied." });

const loadChatForUser = async (chatId, user) => {
  if (!isValidChatObjectId(chatId)) {
    return { allowed: false, status: 400, message: "Invalid chat id." };
  }

  const chat = await Chat.findById(chatId);
  if (!chat) return { allowed: false, status: 404, message: "Conversation not found." };

  const access = await authorizeChatForUser(chat, user);
  return access.allowed ? { ...access, chat } : access;
};

const getAuthorizedChatsForUser = async (user) => {
  const chats = await Chat.find({ participants: user._id, type: "Direct" })
    .populate("participants", "fullName email role")
    .populate({ path: "lastMessage", populate: { path: "sender", select: "fullName role" } })
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  return (await Promise.all(
    chats.map(async (chat) => {
      const access = await authorizeChatForUser(chat, user);
      if (!access.allowed) return null;
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        receiver: user._id,
        status: { $ne: "seen" },
        deletedFor: { $ne: user._id },
      });
      return { ...chat.toObject(), unreadCount };
    }),
  )).filter(Boolean);
};

export const createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!isValidChatObjectId(participantId)) {
      return res.status(400).json({ success: false, message: "Invalid participant id." });
    }

    const permission = await canUsersChat(req.user, participantId);
    if (!permission.allowed) return chatAccessError(res, permission);

    let chat = await Chat.findOne({
      type: "Direct",
      participants: { $all: [req.user._id, participantId], $size: 2 },
    })
      .populate("participants", "fullName email role")
      .populate("lastMessage");

    const created = !chat;
    if (created) {
      chat = await Chat.create({
        participants: [req.user._id, participantId],
        createdBy: req.user._id,
        type: "Direct",
      });
      chat = await Chat.findById(chat._id)
        .populate("participants", "fullName email role")
        .populate("lastMessage");
    }

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Conversation created successfully." : "Conversation already exists.",
      chat,
    });
  } catch (error) {
    console.error("createChat error:", error);
    return res.status(500).json({ success: false, message: "Unable to create conversation." });
  }
};

export const getAvailableUsers = async (req, res) => {
  try {
    const users = await getAllowedChatTargets(req.user);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("getAvailableUsers error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch users." });
  }
};

export const getChats = async (req, res) => {
  try {
    const authorizedChats = await getAuthorizedChatsForUser(req.user);

    return res.status(200).json({ success: true, chats: authorizedChats });
  } catch (error) {
    console.error("getChats error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch conversations." });
  }
};

export const searchChats = async (req, res) => {
  try {
    const keyword = (req.query.search || "").trim().toLowerCase();
    const chats = (await getAuthorizedChatsForUser(req.user)).filter((chat) =>
      chat.participants.some((participant) =>
        participant._id.toString() !== currentUserId(req) &&
        [participant.fullName, participant.email, participant.role]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword)),
      ),
    );
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("searchChats error:", error);
    return res.status(500).json({ success: false, message: "Unable to search conversations." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const access = await loadChatForUser(req.params.chatId, req.user);
    if (!access.allowed) return chatAccessError(res, access);

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const filter = { chat: access.chat._id, deletedFor: { $ne: req.user._id } };
    const [totalMessages, messages] = await Promise.all([
      Message.countDocuments(filter),
      Message.find(filter)
        .populate("sender", "fullName role")
        .populate("receiver", "fullName role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,
      totalMessages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch messages." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const access = await loadChatForUser(req.params.chatId, req.user);
    if (!access.allowed) return chatAccessError(res, access);

    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    const messageType = req.body.messageType || "text";
    const attachment = req.file
      ? { url: req.file.path, fileName: req.file.originalname, mimeType: req.file.mimetype, fileSize: req.file.size }
      : { url: "", fileName: "", mimeType: "", fileSize: 0 };
    if (!message && !attachment.url) {
      return res.status(400).json({ success: false, message: "Message or attachment is required." });
    }

    const newMessage = await Message.create({
      chat: access.chat._id,
      sender: req.user._id,
      receiver: access.otherParticipant,
      message,
      messageType,
      attachment,
      status: "sent",
    });
    access.chat.lastMessage = newMessage._id;
    access.chat.lastMessageAt = new Date();
    await access.chat.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "fullName role")
      .populate("receiver", "fullName role");
    const notification = await createNotification({
      title: "New message",
      message: `${req.user.fullName} sent you a message.`,
      sender: req.user._id,
      receiver: access.otherParticipant,
    });
    const io = getIO();
    if (io) {
      io.to(access.chat._id.toString()).emit("receive-message", populatedMessage);
      for (const participant of access.chat.participants) {
        io.to(participant.toString()).emit("refresh-chats");
      }
    }

    return res.status(201).json({ success: true, message: "Message sent successfully.", data: populatedMessage, notification });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ success: false, message: "Unable to send message." });
  }
};

export const editMessage = async (req, res) => {
  try {
    const existingMessage = await Message.findById(req.params.messageId);
    if (!existingMessage) return res.status(404).json({ success: false, message: "Message not found." });
    const access = await loadChatForUser(existingMessage.chat, req.user);
    if (!access.allowed || existingMessage.sender.toString() !== currentUserId(req)) {
      return chatAccessError(res, access.allowed ? { status: 403, message: "Access denied." } : access);
    }
    if (typeof req.body.message !== "string" || !req.body.message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }
    existingMessage.message = req.body.message.trim();
    existingMessage.isEdited = true;
    existingMessage.editedAt = new Date();
    await existingMessage.save();
    getIO()?.to(access.chat._id.toString()).emit("message-edited", existingMessage);
    return res.status(200).json({ success: true, message: "Message updated successfully.", data: existingMessage });
  } catch (error) {
    console.error("editMessage error:", error);
    return res.status(500).json({ success: false, message: "Unable to update message." });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    const access = await loadChatForUser(message.chat, req.user);
    if (!access.allowed || message.sender.toString() !== currentUserId(req)) {
      return chatAccessError(res, access.allowed ? { status: 403, message: "Access denied." } : access);
    }
    if (!message.deletedFor.some((id) => id.toString() === currentUserId(req))) {
      message.deletedFor.push(req.user._id);
      await message.save();
    }
    return res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("deleteMessage error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete message." });
  }
};

export const markMessagesSeen = async (req, res) => {
  try {
    const access = await loadChatForUser(req.params.chatId, req.user);
    if (!access.allowed) return chatAccessError(res, access);
    await Message.updateMany(
      { chat: access.chat._id, receiver: req.user._id, status: { $ne: "seen" } },
      { status: "seen", seenAt: new Date() },
    );
    getIO()?.to(access.chat._id.toString()).emit("messages-seen", {
      chatId: access.chat._id.toString(),
      userId: currentUserId(req),
    });
    return res.status(200).json({ success: true, message: "Messages marked as seen." });
  } catch (error) {
    console.error("markMessagesSeen error:", error);
    return res.status(500).json({ success: false, message: "Unable to mark messages as seen." });
  }
};
