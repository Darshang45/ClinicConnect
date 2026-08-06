import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function ConversationItem({
  chat,
  active,
  onClick,
  onlineUsers = [],
}) {
  const currentUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const currentUserId =
  currentUser._id || currentUser.id;

const participant =
  chat.participants?.find(
    (user) => user._id !== currentUserId
  ) || chat.participants?.[0];



  /* ==========================================
     Online Status
  ========================================== */

  const isOnline =
    onlineUsers.includes(
      participant?._id
    );

  /* ==========================================
     Unread Count
  ========================================== */

  const unreadCount =
    chat.unreadCount || 0;

  /* ==========================================
     Last Message Preview
  ========================================== */

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
        preview =
          chat.lastMessage.message;
        break;

      default:
        preview =
          chat.lastMessage.message || "";
    }

    if (
      chat.lastMessage.isEdited
    ) {
      preview += " (edited)";
    }

  }

  /* ==========================================
     Last Message Time
  ========================================== */

  const lastMessageTime =
    chat.lastMessageAt
      ? new Date(
          chat.lastMessageAt
        ).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  return (
    <button
      type="button"
      className={`doc-chat-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {/* ======================================
          Avatar
      ======================================= */}

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

      {/* ======================================
          Details
      ======================================= */}

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