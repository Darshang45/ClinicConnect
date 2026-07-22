import { FiBell } from "react-icons/fi";
import "../../../styles/patient_dashboard.css";

function Notification({ items, className = "" }) {
  return (
    <div className={`pd-notification-list ${className}`.trim()}>
      {items.map((notification) => (
        <article className="pd-notification-item" key={notification.id}>
          <span><FiBell /></span>
          <div>
            <h3>{notification.title}</h3>
            <p>{notification.description}</p>
          </div>
          <time>{notification.time}</time>
        </article>
      ))}
    </div>
  );
}

export default Notification;
