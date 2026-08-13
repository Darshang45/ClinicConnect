import { useState } from "react";
import { MdCampaign, MdSchedule } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import api, { getApiErrorMessage } from "../../../services/api";
import "../../../styles/reception_dashboard.css";

const priorities = ["High Priority", "Low Priority"];
const recipients = ["All Personnel", "Doctors", "Patients"];
const deliveryModes = ["Push Notification + Email", "Dashboard Alert Only", "SMS (Emergency)"];

function BroadcastCenter() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState(priorities[0]);
  const [recipient, setRecipient] = useState(recipients[0]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [scheduledFor, setScheduledFor] = useState(null);
  const [sending, setSending] = useState(false);

  const updateSchedule = (event) => {
    const { name, value } = event.target;
    setSchedule((currentSchedule) => ({ ...currentSchedule, [name]: value }));
  };

  const scheduleBroadcast = (event) => {
    event.preventDefault();
    setScheduledFor(schedule);
    setIsScheduleOpen(false);
  };

  const handleSendBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please provide both an announcement title and message.");
      return;
    }

    try {
      setSending(true);

      await api.post("/announcements", {
        title: title.trim(),
        message: message.trim(),
        targetAudience: recipient === "All Personnel" ? "Everyone" : recipient,
        dashboardAlert: true,
        priority: priority === "High Priority" ? "High" : "Low",
      });

      alert("Broadcast sent successfully!");
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert(getApiErrorMessage(error, "Failed to send broadcast."));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rc-broadcast-section" id="broadcast">
      <Card className="rc-broadcast-card">
        <div className="rc-broadcast-title">
          <MdCampaign />
          <h2>Broadcast Center</h2>
        </div>

        <div className="rc-broadcast-grid">
          <div className="rc-broadcast-fields">
            <label className="rc-form-field">
              <span>Announcement Title</span>
              <input
                placeholder="e.g. System Maintenance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="rc-form-field">
              <span>Message</span>
              <textarea
                placeholder="Type your broadcast message here..."
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
          </div>

          <div className="rc-broadcast-options">
            <div className="rc-recipient-options">
              <span>Recipients</span>
              <div>
                {recipients.map((option) => (
                  <Button
                    className={recipient === option ? "is-active" : ""}
                    key={option}
                    onClick={() => setRecipient(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <fieldset className="rc-delivery-modes">
              <legend>Delivery Mode</legend>
              {deliveryModes.map((mode) => (
                <label key={mode}>
                  <input name="delivery-mode" type="checkbox" defaultChecked /> {mode}
                </label>
              ))}
            </fieldset>
          </div>
        </div>

        <footer className="rc-broadcast-footer">
          <div className="rc-broadcast-meta">
            <div className="rc-priority-toggle" aria-label="Broadcast priority">
              {priorities.map((option) => (
                <Button
                  className={priority === option ? "is-active" : ""}
                  key={option}
                  onClick={() => setPriority(option)}
                >
                  <i />
                  {option}
                </Button>
              ))}
            </div>

            <Button
              className="rc-schedule-button"
              data-scheduled-for={
                scheduledFor ? `${scheduledFor.date} ${scheduledFor.time}` : undefined
              }
              onClick={() => setIsScheduleOpen(true)}
            >
              <MdSchedule /> Schedule for later
            </Button>
          </div>

          <Button
            className="rc-send-broadcast"
            disabled={sending}
            onClick={handleSendBroadcast}
          >
            {sending ? "Sending..." : "Send Broadcast"}
          </Button>
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
          <Input
            className="rc-modal-field"
            label="Date"
            name="date"
            onChange={updateSchedule}
            required
            type="date"
            value={schedule.date}
          />
          <Input
            className="rc-modal-field"
            label="Time"
            name="time"
            onChange={updateSchedule}
            required
            type="time"
            value={schedule.time}
          />
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
