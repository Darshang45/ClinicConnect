import Card from "../../../components/common/Card";
import Notification from "../../../components/common/Notification/Notification";
import { notifications } from "../data/notifications";
import "../../../styles/patient_dashboard.css";

function Notifications() {
  return (
    <Card className="pd-notification-panel" id="notifications">
      <div className="pd-section-heading">
        <h2>Notifications</h2>
        <a href="#notifications">Mark all as read</a>
      </div>
<<<<<<< HEAD
      <NotificationList items={notifications} />
=======
      <Notification items={notifications} />
>>>>>>> ea5d54ac4efa2196a5a78fec8d1d52983f2401b5
    </Card>
  );
}

export default Notifications;
