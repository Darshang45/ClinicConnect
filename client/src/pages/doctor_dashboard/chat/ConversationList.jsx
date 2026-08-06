import ConversationItem from "./ConversationItem";
import Button from "../../../components/common/Button";

import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function ConversationList({
  chats,
  loading,
  selectedChat,
  search,
  onSearchChange,
  onSelectChat,
  onNewChat,
  onlineUsers,
}) {
  return (
    <section className="doc-chat-sidebar">

      {/* ===========================================
          Header
      ============================================ */}

      <div className="doc-chat-sidebar-header">

        <div>

          <h2>Messages</h2>

          <small>
            {loading
              ? "Loading..."
              : `${chats.length} Conversation${
                  chats.length !== 1 ? "s" : ""
                }`}
          </small>

        </div>

        <Button
          className="doc-new-chat-button"
          onClick={onNewChat}
        >
          <span className="material-symbols-outlined">
            add
          </span>

          New Chat
        </Button>

      </div>

      {/* ===========================================
          Search
      ============================================ */}

      <div className="doc-chat-search">

        <span className="material-symbols-outlined">
          search
        </span>

        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />

      </div>

      {/* ===========================================
          Conversation List
      ============================================ */}

      <div className="doc-chat-list">

        {loading ? (

          <div className="doc-chat-empty">

            <span className="material-symbols-outlined">
              hourglass_top
            </span>

            <p>Loading conversations...</p>

          </div>

        ) : chats.length === 0 ? (

          <div className="doc-chat-empty">

            <span className="material-symbols-outlined">
              forum
            </span>

            <h3>No Conversations</h3>

            <p>
              Start a new conversation to
              begin chatting.
            </p>

          </div>

        ) : (

          chats.map((chat) => (

            <ConversationItem
  key={chat._id}
  chat={chat}
  active={
    selectedChat?._id ===
    chat._id
  }
  onlineUsers={onlineUsers}
  onClick={() =>
    onSelectChat(chat)
  }
/>

          ))

        )}

      </div>

    </section>
  );
}

export default ConversationList;