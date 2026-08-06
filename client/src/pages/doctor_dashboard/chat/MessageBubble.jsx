import { useMemo } from "react";

import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function MessageBubble({ message }) {
  const currentUser = useMemo(
    () =>
      JSON.parse(
        localStorage.getItem("user") || "{}"
      ),
    []
  );

  const isOwnMessage =
    message.sender?._id === currentUser?._id;

  /* ==========================================
     Time
  ========================================== */

  const messageTime = new Date(
    message.createdAt
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* ==========================================
     Status Icon
  ========================================== */

  const getStatusIcon = () => {
    switch (message.status) {
      case "seen":
        return "done_all";

      case "delivered":
        return "done_all";

      default:
        return "done";
    }
  };

  /* ==========================================
     Attachment
  ========================================== */

  const renderAttachment = () => {
    if (!message.attachment?.url) return null;

    switch (message.messageType) {
      case "image":
        return (
          <img
            src={message.attachment.url}
            alt={message.attachment.fileName}
            className="doc-chat-image"
          />
        );

      case "pdf":
        return (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-message-attachment"
          >
            <span className="material-symbols-outlined">
              picture_as_pdf
            </span>

            {message.attachment.fileName ||
              "View PDF"}
          </a>
        );

      case "report":
        return (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-message-attachment"
          >
            <span className="material-symbols-outlined">
              description
            </span>

            {message.attachment.fileName ||
              "Medical Report"}
          </a>
        );

      case "file":
        return (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-message-attachment"
          >
            <span className="material-symbols-outlined">
              attach_file
            </span>

            {message.attachment.fileName ||
              "Attachment"}
          </a>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`doc-message-row ${
        isOwnMessage
          ? "sent"
          : "received"
      }`}
    >
      <div
        className={`doc-message-bubble ${
          isOwnMessage
            ? "sent"
            : "received"
        }`}
      >
        {!isOwnMessage && (
          <small className="doc-message-sender">
            {message.sender?.fullName}
          </small>
        )}

        {renderAttachment()}

        {message.message && (
          <p className="doc-message-text">
            {message.message}
          </p>
        )}

        {message.isEdited && (
          <small className="doc-message-edited">
            Edited
          </small>
        )}

        <div className="doc-message-footer">
          <small>
            {messageTime}
          </small>

          {isOwnMessage && (
            <span
              className={`material-symbols-outlined doc-message-status ${
                message.status === "seen"
                  ? "seen"
                  : ""
              }`}
            >
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;