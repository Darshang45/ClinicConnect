import api from "./api";

/**
 * Get all notifications for current user
 */
export const getNotifications = async (params = {}) => {
  const { data } = await api.get("/notifications", { params });
  return data;
};

/**
 * Get unread notifications for current user
 */
export const getUnreadNotifications = async (params = {}) => {
  const { data } = await api.get("/notifications/unread", { params });
  return data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const { data } = await api.patch("/notifications/read-all");
  return data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};
