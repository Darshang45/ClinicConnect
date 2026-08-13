import Card from "../../../components/common/Card";
import Notification from "../../../components/common/Notification/Notification";
import { useSocket } from "../../../context/SocketContext";
import { formatTime } from "../../../utils/formatTime";
import "../../../styles/patient_dashboard.css";

function Notifications() {
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
    <Card className="pd-notification-panel" id="notifications">
      <div className="pd-section-heading">
        <h2>Notifications</h2>
        <button
          type="button"
          style={{ background: "none", border: "none", color: "var(--color-primary, #0284c7)", cursor: "pointer", fontWeight: 600 }}
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>

      {formattedItems.length === 0 ? (
        <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>
          No notifications remaining.
        </div>
      ) : (
        <Notification items={formattedItems} onItemClick={(id) => markNotificationAsRead(id)} />
      )}
    </Card>
  );
}

export default Notifications;
