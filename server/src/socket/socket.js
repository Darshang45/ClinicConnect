import jwt from "jsonwebtoken";

import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { authorizeChatForUser, isValidChatObjectId } from "../services/chatAuthorization.service.js";

let ioInstance = null;
const onlineUsers = new Map();

const getUserFromToken = async (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select("-password");
  } catch {
    return null;
  }
};

const publishOnlineUsers = (io) => io.emit("online-users", Array.from(onlineUsers.keys()));

const registerSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId) || new Set();
  sockets.add(socketId);
  onlineUsers.set(userId, sockets);
};

const unregisterSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(userId);
};

const emitChatError = (socket, chatId, message) =>
  socket.emit("chat-error", { chatId: chatId ? String(chatId) : undefined, message });

const withAuthorizedChat = async (socket, chatId, callback) => {
  if (!isValidChatObjectId(chatId)) {
    emitChatError(socket, chatId, "Invalid chat id.");
    return;
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    emitChatError(socket, chatId, "Conversation not found.");
    return;
  }

  const access = await authorizeChatForUser(chat, socket.user);
  if (!access.allowed) {
    emitChatError(socket, chatId, access.message || "Access denied.");
    return;
  }

  await callback(chat);
};

const initializeSocket = (io) => {
  ioInstance = io;

  io.use(async (socket, next) => {
    const user = await getUserFromToken(socket.handshake.auth?.token);
    if (!user || !user.isActive) return next(new Error("Unauthorized"));
    socket.user = user;
    return next();
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    registerSocket(userId, socket.id);
    socket.join(userId);

    // These rooms support server-generated role/broadcast notifications only.
    // They are never used for chat membership or client-controlled delivery.
    if (socket.user.role) socket.join(`notification:role:${socket.user.role}`);
    socket.join("notification:all");
    publishOnlineUsers(io);

    socket.on("join-chat", async (chatId) => {
      try {
        await withAuthorizedChat(socket, chatId, async (chat) => {
          socket.join(chat._id.toString());
          socket.emit("chat-joined", { chatId: chat._id.toString() });
        });
      } catch (error) {
        console.error("join-chat error:", error.message);
        emitChatError(socket, chatId, "Unable to join conversation.");
      }
    });

    socket.on("leave-chat", (chatId) => {
      if (isValidChatObjectId(chatId)) socket.leave(String(chatId));
    });

    socket.on("typing", async ({ chatId } = {}) => {
      try {
        await withAuthorizedChat(socket, chatId, async (chat) => {
          socket.to(chat._id.toString()).emit("typing", {
            chatId: chat._id.toString(),
            userId,
            userName: socket.user.fullName,
          });
        });
      } catch (error) {
        console.error("typing error:", error.message);
      }
    });

    socket.on("stop-typing", async ({ chatId } = {}) => {
      try {
        await withAuthorizedChat(socket, chatId, async (chat) => {
          socket.to(chat._id.toString()).emit("stop-typing", {
            chatId: chat._id.toString(),
            userId,
          });
        });
      } catch (error) {
        console.error("stop-typing error:", error.message);
      }
    });

    // Messages, notifications, read receipts, and list refreshes are generated
    // only by authenticated HTTP controllers.  Client payloads must never choose
    // a sender, recipient, room, or notification target.
    socket.on("send-message", () => emitChatError(socket, null, "Messages must be sent through the authenticated API."));
    socket.on("send-notification", () => emitChatError(socket, null, "Notifications are server generated."));
    socket.on("refresh-chats", () => emitChatError(socket, null, "Conversation refreshes are server generated."));

    socket.on("disconnect", () => {
      unregisterSocket(userId, socket.id);
      publishOnlineUsers(io);
    });
  });
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
export const getSocketId = (userId) => Array.from(onlineUsers.get(userId.toString()) || [])[0] || null;
export const isUserOnline = (userId) => onlineUsers.has(userId.toString());
export const getIO = () => ioInstance;

export default initializeSocket;
