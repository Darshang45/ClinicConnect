import Notification from "../../../components/common/Notification/Notification";
import { receptionNotifications } from "../data/communications";

function ReceptionNotificationPanel({ panelRef }) {
  return (
    <section className="rc-notification-dropdown" id="reception-notifications" ref={panelRef} aria-label="Notifications">
      <div className="rc-popover-heading">
        <h2>Notifications</h2>
        <span>Mark all read</span>
      </div>
      <Notification items={receptionNotifications} />
    </section>
  );
}

export default ReceptionNotificationPanel;
