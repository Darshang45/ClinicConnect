import { useState } from "react";
import { MdCampaign, MdSchedule } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import "../../../styles/reception_dashboard.css";

const priorities = ["High Priority", "Low Priority"];
const recipients = ["All Personnel", "Doctors", "Patients"];
const deliveryModes = ["Push Notification + Email", "Dashboard Alert Only", "SMS (Emergency)"];

function BroadcastCenter() {
  const [priority, setPriority] = useState(priorities[0]);
  const [recipient, setRecipient] = useState(recipients[0]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [scheduledFor, setScheduledFor] = useState(null);

  const updateSchedule = (event) => {
    const { name, value } = event.target;
    setSchedule((currentSchedule) => ({ ...currentSchedule, [name]: value }));
  };

  const scheduleBroadcast = (event) => {
    event.preventDefault();
    setScheduledFor(schedule);
    setIsScheduleOpen(false);
  };

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
                {recipients.map((option) => (
                  <Button className={recipient === option ? "is-active" : ""} key={option} onClick={() => setRecipient(option)}>{option}</Button>
                ))}
              </div>
            </div>
            <fieldset className="rc-delivery-modes">
              <legend>Delivery Mode</legend>
              {deliveryModes.map((mode) => (
                <label key={mode}><input name="delivery-mode" type="checkbox" /> {mode}</label>
              ))}
            </fieldset>
          </div>
        </div>
        <footer className="rc-broadcast-footer">
          <div className="rc-broadcast-meta">
            <div className="rc-priority-toggle" aria-label="Broadcast priority">
              {priorities.map((option) => (
                <Button className={priority === option ? "is-active" : ""} key={option} onClick={() => setPriority(option)}><i />{option}</Button>
              ))}
            </div>
            <Button className="rc-schedule-button" data-scheduled-for={scheduledFor ? `${scheduledFor.date} ${scheduledFor.time}` : undefined} onClick={() => setIsScheduleOpen(true)}><MdSchedule /> Schedule for later</Button>
          </div>
          <Button className="rc-send-broadcast">Send Broadcast</Button>
        </footer>
      </Card>
      <Modal
        className="rc-modal"
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        overlayClassName="rc-modal-backdrop"
        title="Schedule broadcast"
      >
        <form className="rc-schedule-form" onSubmit={scheduleBroadcast}>
          <Input className="rc-modal-field" label="Date" name="date" onChange={updateSchedule} required type="date" value={schedule.date} />
          <Input className="rc-modal-field" label="Time" name="time" onChange={updateSchedule} required type="time" value={schedule.time} />
          <div className="rc-modal-actions">
            <Button onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default BroadcastCenter;
