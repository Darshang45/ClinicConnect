import { MdCampaign, MdSchedule } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

const recipients = ["All Personnel", "Doctors", "Patients", "Staff Only"];
const deliveryModes = ["Push Notification + Email", "Dashboard Alert Only", "SMS (Emergency)"];

function BroadcastCenter() {
  return (
    <section className="rc-broadcast-section" id="broadcast">
      <Card className="rc-broadcast-card">
        <div className="rc-broadcast-title"><MdCampaign /><h2>Broadcast Center</h2></div>
        <div className="rc-broadcast-grid">
          <div className="rc-broadcast-fields">
            <label className="rc-form-field">
              <span>Announcement Title</span>
              <input placeholder="e.g. System Maintenance" />
            </label>
            <label className="rc-form-field">
              <span>Message</span>
              <textarea placeholder="Type your broadcast message here..." rows="5" />
            </label>
          </div>
          <div className="rc-broadcast-options">
            <div className="rc-recipient-options">
              <span>Recipients</span>
              <div>
                {recipients.map((recipient, index) => (
                  <Button className={index === 0 ? "is-active" : ""} key={recipient}>{recipient}</Button>
                ))}
              </div>
            </div>
            <fieldset className="rc-delivery-modes">
              <legend>Delivery Mode</legend>
              {deliveryModes.map((mode) => (
                <label key={mode}><input name="delivery-mode" type="radio" /> {mode}</label>
              ))}
            </fieldset>
          </div>
        </div>
        <footer className="rc-broadcast-footer">
          <div className="rc-broadcast-meta">
            <span className="rc-high-priority"><i /> High Priority</span>
            <Button className="rc-schedule-button"><MdSchedule /> Schedule for later</Button>
          </div>
          <Button className="rc-send-broadcast">Send Broadcast</Button>
        </footer>
      </Card>
    </section>
  );
}

export default BroadcastCenter;
