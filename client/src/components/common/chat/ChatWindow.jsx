import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useAuth } from "../../../context/AuthContext";

import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function ChatWindow({
  chat,
  messages,
  loading,
  typingUser,
  onMessageSent,
}) {
  const bottomRef = useRef(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  if (!chat) {
    return (
      <section className="doc-chat-window">
        <div className="doc-chat-empty">
          <span className="material-symbols-outlined">
            forum
          </span>

          <h3>No Conversation Selected</h3>

          <p>
            Select a conversation from the
            left or start a new chat.
          </p>
        </div>
      </section>
    );
  }

  const currentUserId =
    currentUser._id || currentUser.id;

  const participant =
    chat.participants?.find(
      (user) =>
        String(user._id || user.id) !==
        String(currentUserId)
    ) || chat.participants?.[0];

  const getDateLabel = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    const isToday =
      today.toDateString() ===
      messageDate.toDateString();

    if (isToday) return "Today";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      yesterday.toDateString() ===
      messageDate.toDateString()
    ) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <section className="doc-chat-window">
      <header className="doc-chat-header">
        <div className="doc-chat-user">
          {participant?.profilePhoto ? (
            <img
              src={
                participant.profilePhoto
              }
              alt={
                participant.fullName
              }
              className="doc-chat-avatar"
            />
          ) : (
            <span className="material-symbols-outlined doc-chat-avatar-icon">
              account_circle
            </span>
          )}

          <div className="doc-chat-user-info">
            <strong>
              {participant?.fullName ||
                "Unknown User"}
            </strong>

            <span>
              {participant?.role}
            </span>
          </div>
        </div>
      </header>

      <div className="doc-chat-messages">
        {loading ? (
          <div className="doc-chat-empty">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="doc-chat-empty">
            <span className="material-symbols-outlined">
              chat
            </span>

            <h3>
              No Messages Yet
            </h3>

            <p>
              Start the conversation
              below.
            </p>
          </div>
        ) : (
          <>
            {messages.map(
              (message, index) => {
                const label =
                  getDateLabel(
                    message.createdAt
                  );

                const showDate =
                  index === 0 ||
                  label !== getDateLabel(messages[index - 1].createdAt);

                return (
                  <div
                    key={message._id}
                  >
                    {showDate && (
                      <div className="doc-chat-date">
                        {label}
                      </div>
                    )}

                    <MessageBubble
                      message={
                        message
                      }
                    />
                  </div>
                );
              }
            )}

            {typingUser && (
              <div className="doc-chat-typing">
                <span>
                  {typingUser}
                </span>

                <div className="doc-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      <MessageInput
        chatId={chat._id}
        onMessageSent={
          onMessageSent
        }
      />
    </section>
  );
}

export default ChatWindow;
