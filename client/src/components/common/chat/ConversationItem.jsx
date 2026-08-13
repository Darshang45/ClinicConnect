import { formatTime } from "../../../utils/formatTime";
import { useAuth } from "../../../context/AuthContext";
import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function ConversationItem({
  chat,
  active,
  onClick,
  onlineUsers = [],
}) {
  const { user: currentUser } = useAuth();

  const currentUserId = String(currentUser?._id || currentUser?.id || "");

  const participant =
    chat.participants?.find(
      (user) => String(user._id || user.id) !== currentUserId
    ) || chat.participants?.[0];

  const isOnline =
    onlineUsers.includes(
      participant?._id
    );

  const unreadCount =
    chat.unreadCount || 0;

  let preview = "Start a conversation";

  if (chat.lastMessage) {
    switch (chat.lastMessage.messageType) {
      case "image":
        preview = "📷 Image";
        break;

      case "pdf":
        preview = "📄 PDF";
        break;

      case "report":
        preview = "🩺 Medical Report";
        break;

      case "file":
        preview = "📎 Attachment";
        break;

      case "system":
        preview = chat.lastMessage.message;
        break;

      default:
        preview = chat.lastMessage.message || "";
    }

    if (chat.lastMessage.isEdited) {
      preview += " (edited)";
    }
  }

  const lastMessageTime = chat.lastMessageAt ? formatTime(chat.lastMessageAt) : "";

  return (
    <button
      type="button"
      className={`doc-chat-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <div className="doc-chat-avatar">
        {participant?.profilePhoto ? (
          <img
            src={participant.profilePhoto}
            alt={participant.fullName}
          />
        ) : (
          <span className="material-symbols-outlined">
            account_circle
          </span>
        )}

        {isOnline && (
          <span className="doc-online-indicator" />
        )}
      </div>

      <div className="doc-chat-details">
        <div className="doc-chat-top">
          <strong>
            {participant?.fullName ||
              "Unknown User"}
          </strong>

          <small>
            {lastMessageTime}
          </small>
        </div>

        <span className="doc-chat-role">
          {participant?.role}
        </span>

        <div className="doc-chat-bottom">
          <p className="doc-chat-preview">
            {preview}
          </p>

          {unreadCount > 0 && (
            <span className="doc-chat-unread">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ConversationItem;
