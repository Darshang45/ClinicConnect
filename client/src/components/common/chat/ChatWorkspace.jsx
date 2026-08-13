import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import NewChatModal from "./NewChatModal";

import { getChats, getMessages, markMessagesSeen } from "../../../services/chatService";
import socketService from "../../../services/socketService";
import { useAuth } from "../../../context/AuthContext";

import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

const sortChatsByActivity = (chatList) => [...chatList].sort(
  (left, right) => new Date(
    right.lastMessageAt || right.updatedAt || right.createdAt || 0,
  ) - new Date(left.lastMessageAt || left.updatedAt || left.createdAt || 0),
);

const upsertChat = (chatList, incomingChat) => {
  if (!incomingChat?._id) return chatList;

  const exists = chatList.some(
    (chat) => String(chat._id) === String(incomingChat._id)
  );

  const updatedList = exists
    ? chatList.map((chat) =>
        String(chat._id) === String(incomingChat._id)
          ? { ...chat, ...incomingChat }
          : chat
      )
    : [incomingChat, ...chatList];

  return sortChatsByActivity(updatedList);
};

const updateChatById = (chatList, chatId, updater) => {
  const targetId = String(chatId);

  const nextList = chatList.map((chat) =>
    String(chat._id) === targetId ? updater(chat) : chat
  );

  return sortChatsByActivity(nextList);
};

function ChatWorkspaceContent({ user, role, panelRef, showHeader = false, HeaderComponent = null }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const chatRequestRef = useRef(0);
  const openedChatRef = useRef(null);
  const chatsRef = useRef([]);
  const messageRequestRef = useRef(0);
  const authUserId = String(user?._id || user?.id || "");

  const commitChats = useCallback((nextOrUpdater) => {
    const nextChats = typeof nextOrUpdater === "function"
      ? nextOrUpdater(chatsRef.current)
      : nextOrUpdater;
    chatsRef.current = nextChats;
    setChats(nextChats);
  }, []);

  const loadChats = useCallback(async () => {
    const requestId = ++chatRequestRef.current;
    try {
      const response = await getChats();
      if (requestId !== chatRequestRef.current) return;
      let chatList = Array.isArray(response.chats) ? response.chats : [];
      const openedChat = openedChatRef.current;

      if (openedChat) {
        const returnedChat = chatList.find(
          (chat) => String(chat._id) === String(openedChat._id)
        );

        if (returnedChat) {
          openedChatRef.current = null;
        } else {
          chatList = upsertChat(chatList, openedChat);
          openedChatRef.current = null;
        }
      }

      if (chatList.length === 0 && chatsRef.current.length > 0) {
        chatList = chatsRef.current;
      }

      chatList = sortChatsByActivity(chatList);
      commitChats(chatList);
      setSelectedChat((previous) => {
        if (previous && chatList.some((chat) => String(chat._id) === String(previous._id))) {
          return previous;
        }

        return chatList[0] || null;
      });
    } catch (error) {
      if (requestId === chatRequestRef.current) {
        console.error("Unable to load conversations:", error);
      }
    } finally {
      if (requestId === chatRequestRef.current) setLoadingChats(false);
    }
  }, [commitChats]);

  const loadMessages = useCallback(async (chatId) => {
    const requestId = ++messageRequestRef.current;
    try {
      setLoadingMessages(true);
      setMessages([]);
      const response = await getMessages(chatId);
      if (requestId !== messageRequestRef.current) return;
      setMessages(response.messages || []);
      await markMessagesSeen(chatId);
      commitChats((previous) => updateChatById(previous, chatId, (chat) => ({
        ...chat,
        unreadCount: 0,
      })));
    } catch (error) {
      if (requestId === messageRequestRef.current) {
        console.error("Unable to load messages:", error);
      }
    } finally {
      if (requestId === messageRequestRef.current) setLoadingMessages(false);
    }
  }, [commitChats]);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  useEffect(() => {
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const handleRefreshChats = () => void loadChats();
    socketService.onOnlineUsers(handleOnlineUsers);
    socketService.onRefreshChats(handleRefreshChats);
    return () => {
      socketService.off("online-users", handleOnlineUsers);
      socketService.off("refresh-chats", handleRefreshChats);
    };
  }, [loadChats]);

  useEffect(() => {
    if (!selectedChat) return undefined;
    socketService.joinChat(selectedChat._id);
    void loadMessages(selectedChat._id);
    return () => {
      messageRequestRef.current += 1;
      socketService.leaveChat(selectedChat._id);
    };
  }, [selectedChat, loadMessages]);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    const keyword = search.toLowerCase();
    return chats.filter((chat) => {
      const participant = chat.participants?.find(
        (participantUser) => String(participantUser._id || participantUser.id) !== authUserId,
      );
      return [participant?.fullName, participant?.email, participant?.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [authUserId, chats, search]);

  const handleChatCreated = (chat) => {
    if (!chat?._id) return;

    // Cancel any older chat-list request that could overwrite
    // the list after this create/open operation.
    chatRequestRef.current += 1;

    setLoadingChats(false);

    commitChats((previous) => upsertChat(previous, chat));

    // Only the selected conversation changes.
    // The conversation list remains intact.
    setSelectedChat(chat);
  };

  const handleMessageSent = (newMessage) => {
    if (!newMessage) return;
    setMessages((previous) => (
      previous.some((message) => String(message._id) === String(newMessage._id))
        ? previous
        : [...previous, newMessage]
    ));
    if (!selectedChat?._id) return;

    commitChats((previous) => updateChatById(previous, selectedChat._id, (chat) => ({
      ...chat,
      lastMessage: newMessage,
      lastMessageAt: newMessage.createdAt || new Date().toISOString(),
      updatedAt: newMessage.createdAt || new Date().toISOString(),
      unreadCount: 0,
    })));
  };

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const messageChatId = typeof message.chat === "object" ? message.chat._id : message.chat;
      const isSelectedChat = String(messageChatId) === String(selectedChat?._id);

      if (isSelectedChat) {
        setMessages((previous) => (
          previous.some((item) => String(item._id) === String(message._id))
            ? previous
            : [...previous, message]
        ));
        markMessagesSeen(selectedChat._id).catch((error) => {
          console.error("Unable to mark messages as seen:", error);
        });
      }

      commitChats((previous) => {
        const targetId = String(messageChatId);
        const exists = previous.some((c) => String(c._id) === targetId);

        if (exists) {
          return updateChatById(previous, messageChatId, (chat) => ({
            ...chat,
            lastMessage: message,
            lastMessageAt: message.createdAt || new Date().toISOString(),
            updatedAt: message.createdAt || new Date().toISOString(),
            unreadCount: isSelectedChat ? 0 : (Number(chat.unreadCount) || 0) + 1,
          }));
        }

        // If the conversation doesn't exist locally yet, upsert it
        const incomingChat = typeof message.chat === "object" && message.chat ? message.chat : { _id: messageChatId };
        const newChat = {
          ...incomingChat,
          lastMessage: message,
          lastMessageAt: message.createdAt || new Date().toISOString(),
          updatedAt: message.createdAt || new Date().toISOString(),
          unreadCount: isSelectedChat ? 0 : 1,
        };

        return upsertChat(previous, newChat);
      });
    };
    const handleTyping = ({ chatId, userName }) => {
      setTypingUsers((previous) => ({ ...previous, [chatId]: userName }));
    };
    const handleStopTyping = ({ chatId }) => {
      setTypingUsers((previous) => {
        const updated = { ...previous };
        delete updated[chatId];
        return updated;
      });
    };
    const handleMessagesSeen = () => void loadChats();

    socketService.onReceiveMessage(handleReceiveMessage);
    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleStopTyping);
    socketService.onMessagesSeen(handleMessagesSeen);
    return () => {
      socketService.off("receive-message", handleReceiveMessage);
      socketService.off("typing", handleTyping);
      socketService.off("stop-typing", handleStopTyping);
      socketService.off("messages-seen", handleMessagesSeen);
    };
  }, [commitChats, loadChats, selectedChat]);

  return (
    <aside className="doc-inline-chat" ref={panelRef} aria-label={`${role} Communication`}>
      {showHeader && HeaderComponent && <HeaderComponent />}
      <div className="doc-chat-container">
        <ConversationList
          chats={filteredChats}
          loading={loadingChats}
          selectedChat={selectedChat}
          search={search}
          onSearchChange={setSearch}
          onSelectChat={setSelectedChat}
          onNewChat={() => setShowNewChatModal(true)}
          onlineUsers={onlineUsers}
        />
        <ChatWindow
          chat={selectedChat}
          messages={messages}
          loading={loadingMessages}
          typingUser={typingUsers[selectedChat?._id]}
          onMessageSent={handleMessageSent}
        />
      </div>
  
      <NewChatModal
        open={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onChatCreated={handleChatCreated}
      />
    </aside>
  );
}

function ChatWorkspace(props) {
  const { user } = useAuth();
  const authUserId = String(user?._id || user?.id || "anonymous");
  return <ChatWorkspaceContent key={authUserId} user={user} {...props} />;
}

export default ChatWorkspace;
