import { useEffect, useMemo, useState } from "react";

import DashboardHeader from "../dashboard_header/DashboardHeader";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import NewChatModal from "./NewChatModal";

import {
  getChats,
  getMessages,
  markMessagesSeen,
} from "../../../services/chatService";

import socketService from "../../../services/socketService";

import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function DoctorChatPanel({ panelRef }) {

  /* ==========================================================
     State
  ========================================================== */

  const [chats, setChats] = useState([]);

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [loadingChats, setLoadingChats] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [showNewChatModal, setShowNewChatModal] =
    useState(false);

  const [typingUsers, setTypingUsers] =
    useState({});

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  /* ==========================================================
     Initial Load
  ========================================================== */

  useEffect(() => {

    loadChats();

  }, []);

  /* ==========================================================
     Socket Initialization
  ========================================================== */

  useEffect(() => {

    socketService.connect();

    socketService.onOnlineUsers(
      (users) => {

        setOnlineUsers(users);

      }
    );

    socketService.onRefreshChats(
      () => {

        loadChats();

      }
    );

    return () => {

      socketService.removeAllListeners();

      socketService.disconnect();

    };

  }, []);

  /* ==========================================================
     Selected Chat
  ========================================================== */

  useEffect(() => {

    if (!selectedChat) return;

    socketService.joinChat(
      selectedChat._id
    );

    loadMessages(
      selectedChat._id
    );

    return () => {

      socketService.leaveChat(
        selectedChat._id
      );

    };

  }, [selectedChat]);

  /* ==========================================================
     Load Chats
  ========================================================== */

  const loadChats = async () => {

    try {

      setLoadingChats(true);

      const response =
        await getChats();

      const chatList =
        response.chats || [];

      setChats(chatList);

      if (
        chatList.length &&
        !selectedChat
      ) {

        setSelectedChat(
          chatList[0]
        );

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingChats(false);

    }

  };

  /* ==========================================================
     Load Messages
  ========================================================== */

  const loadMessages = async (
    chatId
  ) => {

    try {

      setLoadingMessages(true);

      const response =
        await getMessages(
          chatId
        );

      setMessages(
        response.messages || []
      );

      await markMessagesSeen(
        chatId
      );

      setChats((previous) =>
        previous.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                unreadCount: 0,
              }
            : chat
        )
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingMessages(false);

    }

  };

  /* ==========================================================
     Search
  ========================================================== */

  const filteredChats =
    useMemo(() => {

      if (!search.trim()) {
        return chats;
      }

      const keyword =
        search.toLowerCase();

      const currentUser =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      return chats.filter((chat) => {

        const participant =
          chat.participants?.find(
            (user) =>
              user._id !== currentUser._id
          );

        if (!participant) {
          return false;
        }

        return (

          participant.fullName
            ?.toLowerCase()
            .includes(keyword)

          ||

          participant.email
            ?.toLowerCase()
            .includes(keyword)

          ||

          participant.role
            ?.toLowerCase()
            .includes(keyword)

        );

      });

    }, [search, chats]);
      /* ==========================================================
     Select Conversation
  ========================================================== */

  const handleSelectChat = (chat) => {

    if (!chat) return;

    setSelectedChat(chat);

  };

  /* ==========================================================
     New Chat Created
  ========================================================== */

  const handleChatCreated = (chat) => {

    if (!chat) return;

    setChats((previous) => {

      const exists = previous.some(
        (item) => item._id === chat._id
      );

      if (exists) {

        return previous.map((item) =>
          item._id === chat._id
            ? chat
            : item
        );

      }

      return [
        chat,
        ...previous,
      ];

    });

    setSelectedChat(chat);

  };

  /* ==========================================================
     Message Sent
  ========================================================== */

  const handleMessageSent = (
    newMessage
  ) => {

    if (!newMessage) return;

    setMessages((previous) => [
      ...previous,
      newMessage,
    ]);

    setChats((previous) =>
      previous.map((chat) => {

        if (
          chat._id !==
          selectedChat?._id
        ) {

          return chat;

        }

        return {

          ...chat,

          lastMessage:
            newMessage,

          lastMessageAt:
            newMessage.createdAt,

        };

      })
    );

    socketService.sendMessage(
      newMessage
    );

    socketService.refreshChats(

      selectedChat.participants.map(
        (participant) =>
          participant._id
      )

    );

  };

  /* ==========================================================
     Refresh Current Chat
  ========================================================== */

  const refreshCurrentChat =
    async () => {

      if (!selectedChat) return;

      await loadMessages(
        selectedChat._id
      );

      await loadChats();

    };

  /* ==========================================================
     Socket Listeners
  ========================================================== */

  useEffect(() => {

    /* =======================================
       Receive Message
    ======================================= */

    socketService.onReceiveMessage(
      (message) => {

        if (
          message.chat ===
          selectedChat?._id
        ) {

          setMessages(
            (previous) => [
              ...previous,
              message,
            ]
          );

          socketService.markMessagesSeen(
            selectedChat._id,
            JSON.parse(
              localStorage.getItem(
                "user"
              ) || "{}"
            )._id
          );

        }

        loadChats();

      }
    );

    /* =======================================
       Typing
    ======================================= */

    socketService.onTyping(
      ({
        chatId,
        userName,
      }) => {

        setTypingUsers(
          (previous) => ({

            ...previous,

            [chatId]:
              userName,

          })
        );

      }
    );

    /* =======================================
       Stop Typing
    ======================================= */

    socketService.onStopTyping(
      ({
        chatId,
      }) => {

        setTypingUsers(
          (previous) => {

            const updated = {
              ...previous,
            };

            delete updated[
              chatId
            ];

            return updated;

          }
        );

      }
    );

    /* =======================================
       Read Receipts
    ======================================= */

    socketService.onMessagesSeen(
      () => {

        loadChats();

      }
    );

    /* =======================================
       Refresh Chats
    ======================================= */

    socketService.onRefreshChats(
      () => {

        loadChats();

      }
    );

    /* =======================================
       Online Users
    ======================================= */

    socketService.onOnlineUsers(
      (users) => {

        setOnlineUsers(
          users
        );

      }
    );

    return () => {

      socketService.removeAllListeners();

    };

  }, [selectedChat]);
    /* ==========================================================
     Render
  ========================================================== */

  return (
    <aside
      className="doc-inline-chat"
      ref={panelRef}
      aria-label="Doctor Communication"
    >
      <DashboardHeader />

      <div className="doc-chat-container">

        <ConversationList
          chats={filteredChats}
          loading={loadingChats}
          selectedChat={selectedChat}
          search={search}
          onSearchChange={setSearch}
          onSelectChat={handleSelectChat}
          onNewChat={() =>
            setShowNewChatModal(true)
          }
          onlineUsers={onlineUsers}
        />

        <ChatWindow
          chat={selectedChat}
          messages={messages}
          loading={loadingMessages}
          typingUser={
            typingUsers[selectedChat?._id]
          }
          onRefresh={refreshCurrentChat}
          onMessageSent={handleMessageSent}
        />

      </div>

      <NewChatModal
        open={showNewChatModal}
        onClose={() =>
          setShowNewChatModal(false)
        }
        onChatCreated={
          handleChatCreated
        }
      />

    </aside>
  );
}

export default DoctorChatPanel;