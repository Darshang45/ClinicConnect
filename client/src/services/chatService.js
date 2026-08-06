import api from "./api";

/* ==========================================================
   Chats
========================================================== */

/**
 * Create new chat
 */
export const createChat = async (participantId) => {
  const { data } = await api.post("/chat", {
    participantId,
  });

  return data;
};

/**
 * Get all chats
 */
export const getChats = async () => {
  const { data } = await api.get("/chat");

  return data;
};

/**
 * Search conversations
 */
export const searchChats = async (search) => {
  const { data } = await api.get("/chat/search", {
    params: {
      search,
    },
  });

  return data;
};

/**
 * Get users available for chat
 */
export const getAvailableUsers = async () => {
  const { data } = await api.get(
    "/chat/available-users"
  );

  return data;
};

/* ==========================================================
   Messages
========================================================== */

/**
 * Get messages with pagination
 */
export const getMessages = async (
  chatId,
  page = 1,
  limit = 50
) => {
  const { data } = await api.get(
    `/chat/${chatId}/messages`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return data;
};

/**
 * Send text / attachment message
 */
export const sendMessage = async (
  chatId,
  payload
) => {
  let response;

  if (payload instanceof FormData) {
    response = await api.post(
      `/chat/${chatId}/messages`,
      payload,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  } else {
    response = await api.post(
      `/chat/${chatId}/messages`,
      payload
    );
  }

  return response.data;
};

/**
 * Edit message
 */
export const editMessage = async (
  messageId,
  message
) => {
  const { data } = await api.patch(
    `/chat/message/${messageId}`,
    {
      message,
    }
  );

  return data;
};

/**
 * Delete message
 */
export const deleteMessage = async (
  messageId
) => {
  const { data } = await api.delete(
    `/chat/message/${messageId}`
  );

  return data;
};

/**
 * Mark messages as seen
 */
export const markMessagesSeen = async (
  chatId
) => {
  const { data } = await api.patch(
    `/chat/${chatId}/seen`
  );

  return data;
};