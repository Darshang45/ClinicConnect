import { FiMessageCircle, FiSearch } from "react-icons/fi";
import Card from "../../../components/common/Card";
import { messages } from "../data/messages";
import "../../../styles/patient_dashboard.css";

function Messages() {
  return (
    <Card className="pd-message-panel" id="messages">
      <div className="pd-section-heading">
        <h2>Messages</h2>
        <a href="#messages">Open inbox</a>
      </div>
      <label className="pd-message-search">
        <FiSearch />
        <input type="search" placeholder="Search conversations" />
      </label>
      <div className="pd-message-list">
        {messages.map((message) => (
          <article className="pd-message-item" key={message.id}>
            <img src={message.image} alt={message.doctor} />
            <div>
              <h3>{message.doctor}</h3>
              <p>{message.preview}</p>
            </div>
            <span className="pd-message-time">
              {message.time}
              {message.unread > 0 && <b>{message.unread}</b>}
            </span>
          </article>
        ))}
      </div>
      <div className="pd-message-footer">
        <FiMessageCircle /> Your care team typically responds within two hours.
      </div>
    </Card>
  );
}

export default Messages;
