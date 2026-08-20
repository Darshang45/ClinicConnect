import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";
import {
  getUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";
import { getChats } from "../services/chatService";

const SocketContext = createContext({
  socket: null,
  connected: false,
  onlineUsers: [],
  notifications: [],
  unreadCount: 0,
  unreadChatSenderCount: 0,
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
  const [unreadChatSenderCount, setUnreadChatSenderCount] = useState(0);
  const notificationIdsRef = useRef(new Set());
  const notificationsRef = useRef([]);
  const unreadChatRequestRef = useRef(0);

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

  const fetchUnreadChatSenderCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    if (!new Set(["patient", "doctor", "receptionist"]).has(user.role)) {
      setUnreadChatSenderCount(0);
      return;
    }

    const requestId = ++unreadChatRequestRef.current;
    const currentUserId = String(user._id || user.id || "");

    try {
      const response = await getChats();
      if (requestId !== unreadChatRequestRef.current) return;

      const uniqueSenderIds = new Set();
      (response.chats || []).forEach((chat) => {
        if (!(Number(chat.unreadCount) > 0)) return;

        const sender = chat.participants?.find(
          (participant) => String(participant?._id || participant?.id) !== currentUserId,
        );
        const senderId = sender?._id || sender?.id;
        if (senderId) uniqueSenderIds.add(String(senderId));
      });

      setUnreadChatSenderCount(uniqueSenderIds.size);
    } catch (error) {
      if (requestId === unreadChatRequestRef.current) {
        console.error("Failed to fetch unread chat senders:", error);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socketService.disconnect();
      notificationIdsRef.current.clear();
      const timer = window.setTimeout(() => {
        setConnected(false);
        setOnlineUsers([]);
        setNotifications([]);
        setUnreadCount(0);
        setUnreadChatSenderCount(0);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const socket = socketService.connect(token);
    const connectedTimer = window.setTimeout(
      () => setConnected(Boolean(socket?.connected)),
      0,
    );

    const fetchTimer = window.setTimeout(() => void fetchUnread(), 0);
    const chatFetchTimer = window.setTimeout(
      () => void fetchUnreadChatSenderCount(),
      0,
    );

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

    const handleChatUnreadStateChanged = () => {
      void fetchUnreadChatSenderCount();
    };

    socketService.onOnlineUsers(handleOnlineUsers);
    socketService.onNotification(handleNewNotification);
    socketService.onRefreshChats(handleChatUnreadStateChanged);
    socketService.onReceiveMessage(handleChatUnreadStateChanged);
    socketService.onMessagesSeen(handleChatUnreadStateChanged);

    return () => {
      window.clearTimeout(connectedTimer);
      window.clearTimeout(fetchTimer);
      window.clearTimeout(chatFetchTimer);
      socketService.off("online-users", handleOnlineUsers);
      socketService.off("new-notification", handleNewNotification);
      socketService.off("refresh-chats", handleChatUnreadStateChanged);
      socketService.off("receive-message", handleChatUnreadStateChanged);
      socketService.off("messages-seen", handleChatUnreadStateChanged);
    };
  }, [isAuthenticated, token, user, fetchUnread, fetchUnreadChatSenderCount]);

  return (
    <SocketContext.Provider
      value={{
        socketService,
        connected,
        onlineUsers,
        notifications,
        unreadCount,
        unreadChatSenderCount,
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
