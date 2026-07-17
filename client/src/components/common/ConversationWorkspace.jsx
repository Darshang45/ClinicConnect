import { useMemo, useState } from "react";
import { FiMessageCircle, FiSearch, FiSend } from "react-icons/fi";
import Card from "./Card";
import "../../styles/patient_dashboard.css";

function ConversationWorkspace({
  threads,
  className = "",
  conversationLabel = "Conversations",
  subtitle = "Online",
  receivedMessage = "Your latest care update is available for review.",
  sentMessage = "Thank you. I will review the details shortly.",
}) {
  const [selectedThreadId, setSelectedThreadId] = useState(threads[0]?.id);
  const [draft, setDraft] = useState("");
  const [latestMessage, setLatestMessage] = useState(sentMessage);
  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) || threads[0],
    [selectedThreadId, threads],
  );
  const unreadCount = threads.reduce((total, thread) => total + thread.unread, 0);

  const sendMessage = () => {
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) return;

    setLatestMessage(trimmedDraft);
    setDraft("");
  };

  return (
    <Card className={`pd-inbox-card ${className}`.trim()}>
      <section className="pd-inbox-list" aria-label={conversationLabel}>
        <div className="pd-section-heading">
          <h2>{conversationLabel}</h2>
          <span>{unreadCount} unread</span>
        </div>
        <label className="pd-message-search">
          <FiSearch />
          <input type="search" placeholder="Search conversations" />
        </label>
        <div className="pd-inbox-threads">
          {threads.map((thread) => {
            const name = thread.name || thread.doctor;
            return (
              <button
                className={`pd-inbox-thread ${thread.id === selectedThread?.id ? "is-selected" : ""}`}
                type="button"
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
              >
                <img src={thread.image} alt={name} />
                <span><strong>{name}</strong><small>{thread.preview}</small></span>
                <time>{thread.time}{thread.unread > 0 && <b>{thread.unread}</b>}</time>
              </button>
            );
          })}
        </div>
      </section>
      <section className="pd-conversation" aria-label="Selected conversation">
        <header>
          <div>
            <FiMessageCircle />
            <span><strong>{selectedThread?.name || selectedThread?.doctor}</strong><small>{subtitle}</small></span>
          </div>
        </header>
        <div className="pd-conversation-body">
          <p className="pd-message-received">{receivedMessage}</p>
          <p className="pd-message-sent">{latestMessage}</p>
        </div>
        <label className="pd-compose">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Write a message..." />
          <button type="button" aria-label="Send message" onClick={sendMessage}><FiSend /></button>
        </label>
      </section>
    </Card>
  );
}

export default ConversationWorkspace;
