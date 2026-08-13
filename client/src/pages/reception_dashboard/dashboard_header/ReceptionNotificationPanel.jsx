import Notification from "../../../components/common/Notification/Notification";
import { useSocket } from "../../../context/SocketContext";
import { formatTime } from "../../../utils/formatTime";

function ReceptionNotificationPanel({ panelRef }) {
  const { notifications, markAllAsRead, markNotificationAsRead } = useSocket();

  const formattedItems = notifications.map((n) => ({
    _id: n._id || n.id,
    id: n._id || n.id || `${n.title || "notification"}-${n.createdAt || n.time || "unknown"}`,
    title: n.title,
    description: n.message || n.description,
    isRead: n.isRead || n.read,
    time: n.createdAt ? formatTime(n.createdAt) : "Just now",
  }));

  return (
    <section
      className="rc-notification-dropdown"
      id="reception-notifications"
      ref={panelRef}
      aria-label="Notifications"
    >
      <div className="rc-popover-heading">
        <h2>Notifications</h2>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-primary, #0284c7)",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
          }}
          onClick={markAllAsRead}
        >
          Mark all read
        </button>
      </div>

      {formattedItems.length === 0 ? (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.875rem",
          }}
        >
          No notifications remaining
        </div>
      ) : (
        <Notification items={formattedItems} onItemClick={(id) => markNotificationAsRead(id)} />
      )}
    </section>
  );
}

export default ReceptionNotificationPanel;
