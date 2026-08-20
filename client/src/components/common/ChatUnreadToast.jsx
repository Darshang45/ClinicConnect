import { useEffect, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";

import "../../styles/chat_unread_toast.css";

function ChatUnreadToast({ senderCount = 0 }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [senderCount]);

  if (!(senderCount > 0) || dismissed) return null;

  return (
    <div className="chat-unread-toast" role="status" aria-live="polite">
      <button
        className="chat-unread-toast-close"
        type="button"
        aria-label="Close"
        onClick={() => setDismissed(true)}
      >
        ×
      </button>
      <FiMessageSquare aria-hidden="true" />
      <span>
        {senderCount} new message{senderCount === 1 ? "" : "s"} in chat
      </span>
    </div>
  );
}

export default ChatUnreadToast;
