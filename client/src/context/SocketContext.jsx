import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";
import {
  getUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";

const SocketContext = createContext({
  socket: null,
  connected: false,
  onlineUsers: [],
  notifications: [],
  unreadCount: 0,
  fetchUnreadNotifications: () => {},
  markAllAsRead: () => {},
  markNotificationAsRead: () => {},
});

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, token, user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationIdsRef = useRef(new Set());
  const notificationsRef = useRef([]);

  useEffect(() => {
    notificationsRef.current = notifications;
    notificationIdsRef.current = new Set(
      notifications
        .map((notification) => notification?._id || notification?.id)
        .filter(Boolean)
        .map(String),
    );
  }, [notifications]);

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await getUnreadNotifications();
      const items = response.data || response.notifications || [];
      setNotifications(items);
      const totalCount =
        typeof response.count === "number"
          ? response.count
          : typeof response.total === "number"
          ? response.total
          : items.filter((item) => !item.isRead && !item.read).length;
      setUnreadCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  }, [isAuthenticated]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, []);

  const handleMarkSingleRead = useCallback(async (target) => {
    const notificationId =
      typeof target === "object" && target !== null
        ? target._id || target.id
        : target;

    if (!notificationId) return;

    const targetItem = notificationsRef.current.find(
      (item) => String(item._id || item.id) === String(notificationId),
    );
    if (!targetItem || targetItem.isRead || targetItem.read) return;

    setNotifications((previous) => previous.map((item) =>
      String(item._id || item.id) === String(notificationId)
        ? { ...item, isRead: true, read: true }
        : item,
    ));
    setUnreadCount((count) => Math.max(0, count - 1));
    markNotificationRead(notificationId).catch((error) =>
      console.error("Failed to mark single notification read:", error),
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socketService.disconnect();
      notificationIdsRef.current.clear();
      const timer = window.setTimeout(() => {
        setConnected(false);
        setOnlineUsers([]);
        setNotifications([]);
        setUnreadCount(0);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const socket = socketService.connect(token);
    const connectedTimer = window.setTimeout(
      () => setConnected(Boolean(socket?.connected)),
      0,
    );

    const fetchTimer = window.setTimeout(() => void fetchUnread(), 0);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleNewNotification = (notification) => {
      const notificationId = String(notification?._id || notification?.id || "");
      if (notificationId && notificationIdsRef.current.has(notificationId)) return;
      if (notificationId) notificationIdsRef.current.add(notificationId);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    };

    socketService.onOnlineUsers(handleOnlineUsers);
    socketService.onNotification(handleNewNotification);

    return () => {
      window.clearTimeout(connectedTimer);
      window.clearTimeout(fetchTimer);
      socketService.off("online-users", handleOnlineUsers);
      socketService.off("new-notification", handleNewNotification);
    };
  }, [isAuthenticated, token, user, fetchUnread]);

  return (
    <SocketContext.Provider
      value={{
        socketService,
        connected,
        onlineUsers,
        notifications,
        unreadCount,
        fetchUnreadNotifications: fetchUnread,
        markAllAsRead: handleMarkAllRead,
        markNotificationAsRead: handleMarkSingleRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export default SocketContext;
