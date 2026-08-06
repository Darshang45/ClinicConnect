import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /* ==========================================================
     Connect
  ========================================================== */

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem("token");

    this.socket = io(
      import.meta.env.VITE_API_URL ||
        "http://localhost:5000",
      {
        transports: ["websocket"],
        autoConnect: true,
        auth: {
          token,
        },
      }
    );

    this.socket.on("connect", () => {
      this.connected = true;
      console.log(
        "🟢 Socket Connected",
        this.socket.id
      );
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
      console.log("🔴 Socket Disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error(error);
    });

    return this.socket;
  }

  /* ==========================================================
     Disconnect
  ========================================================== */

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /* ==========================================================
     Join / Leave Chat
  ========================================================== */

  joinChat(chatId) {
    this.socket?.emit("join-chat", chatId);
  }

  leaveChat(chatId) {
    this.socket?.emit("leave-chat", chatId);
  }

  /* ==========================================================
     Typing
  ========================================================== */

  typing(chatId) {
    this.socket?.emit("typing", {
      chatId,
    });
  }

  stopTyping(chatId) {
    this.socket?.emit("stop-typing", {
      chatId,
    });
  }

  /* ==========================================================
     Message Events
  ========================================================== */

  sendMessage(message) {
    this.socket?.emit(
      "send-message",
      message
    );
  }

  messageDelivered(chatId, messageId) {
    this.socket?.emit(
      "message-delivered",
      {
        chatId,
        messageId,
      }
    );
  }

  markMessagesSeen(chatId, userId) {
    this.socket?.emit(
      "messages-seen",
      {
        chatId,
        userId,
      }
    );
  }

  /* ==========================================================
     Notifications
  ========================================================== */

  sendNotification(
    receiverId,
    notification
  ) {
    this.socket?.emit(
      "send-notification",
      {
        receiverId,
        notification,
      }
    );
  }

  refreshChats(participants) {
    this.socket?.emit(
      "refresh-chats",
      {
        participants,
      }
    );
  }

  /* ==========================================================
     Event Listeners
  ========================================================== */

  onReceiveMessage(callback) {
    this.socket?.on(
      "receive-message",
      callback
    );
  }

  onTyping(callback) {
    this.socket?.on(
      "typing",
      callback
    );
  }

  onStopTyping(callback) {
    this.socket?.on(
      "stop-typing",
      callback
    );
  }

  onMessagesSeen(callback) {
    this.socket?.on(
      "messages-seen",
      callback
    );
  }

  onDelivered(callback) {
    this.socket?.on(
      "message-delivered",
      callback
    );
  }

  onNotification(callback) {
    this.socket?.on(
      "new-notification",
      callback
    );
  }

  onRefreshChats(callback) {
    this.socket?.on(
      "refresh-chats",
      callback
    );
  }

  onOnlineUsers(callback) {
    this.socket?.on(
      "online-users",
      callback
    );
  }

  /* ==========================================================
     Remove Listeners
  ========================================================== */

  off(event, callback) {
    this.socket?.off(
      event,
      callback
    );
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  /* ==========================================================
     Get Socket
  ========================================================== */

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected;
  }
}

const socketService =
  new SocketService();

export default socketService;