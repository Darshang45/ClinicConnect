import { FiBell, FiCheck } from "react-icons/fi";
import "../../../styles/patient_dashboard.css";

function Notification({ items = [], className = "", onItemClick = null }) {
  return (
    <div className={`pd-notification-list ${className}`.trim()}>
      {items.map((notification) => {
        const notificationId = notification._id || notification.id;
        const isRead = notification.isRead || notification.read;

        return (
          <article
            className={`pd-notification-item ${isRead ? "is-read" : "is-unread"}`}
            key={notificationId || `${notification.title || "notification"}-${notification.createdAt || notification.time || "unknown"}`}
            onClick={() => onItemClick && notificationId && onItemClick(notificationId)}
            style={{
              cursor: onItemClick ? "pointer" : "default",
              opacity: isRead ? 0.7 : 1,
            }}
          >
            <span><FiBell /></span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: isRead ? 500 : 700 }}>{notification.title}</h3>
              <p>{notification.description}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
              <time>{notification.time}</time>
              {onItemClick && !isRead && (
                <button
                  type="button"
                  title="Mark as read"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (notificationId) onItemClick(notificationId);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                >
                  <FiCheck />
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Notification;
