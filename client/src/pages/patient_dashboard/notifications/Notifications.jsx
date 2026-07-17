import Card from "../../../components/common/Card";
import NotificationList from "../../../components/common/NotificationList";
import { notifications } from "../data/notifications";
import "../../../styles/patient_dashboard.css";

function Notifications() {
  return (
    <Card className="pd-notification-panel" id="notifications">
      <div className="pd-section-heading">
        <h2>Notifications</h2>
        <a href="#notifications">Mark all as read</a>
      </div>
      <NotificationList items={notifications} />
    </Card>
  );
}

export default Notifications;
