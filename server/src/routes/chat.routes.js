import express from "express";

import {
  createChat,
  getChats,
  searchChats,
  getAvailableUsers,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markMessagesSeen,
} from "../controllers/chat.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===========================================================
   Chats
=========================================================== */

/**
 * Create new chat
 * POST /api/chat
 */
router.post(
  "/",
  authenticate,
  createChat
);

/**
 * Get all chats
 * GET /api/chat
 */
router.get(
  "/",
  authenticate,
  getChats
);

/**
 * Search chats
 * GET /api/chat/search?search=rahul
 */
router.get(
  "/search",
  authenticate,
  searchChats
);

/**
 * Available users
 * GET /api/chat/available-users
 */
router.get(
  "/available-users",
  authenticate,
  getAvailableUsers
);

/* ===========================================================
   Messages
=========================================================== */

/**
 * Get chat messages
 * GET /api/chat/:chatId/messages?page=1&limit=50
 */
router.get(
  "/:chatId/messages",
  authenticate,
  getMessages
);

/**
 * Send message
 * POST /api/chat/:chatId/messages
 */
router.post(
  "/:chatId/messages",
  authenticate,
  sendMessage
);

/**
 * Edit message
 * PATCH /api/chat/message/:messageId
 */
router.patch(
  "/message/:messageId",
  authenticate,
  editMessage
);

/**
 * Delete message (Soft Delete)
 * DELETE /api/chat/message/:messageId
 */
router.delete(
  "/message/:messageId",
  authenticate,
  deleteMessage
);

/**
 * Mark messages as seen
 * PATCH /api/chat/:chatId/seen
 */
router.patch(
  "/:chatId/seen",
  authenticate,
  markMessagesSeen
);

export default router;