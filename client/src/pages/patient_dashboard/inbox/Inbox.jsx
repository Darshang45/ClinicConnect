import { FiMessageCircle, FiSearch, FiSend } from "react-icons/fi";
import Card from "../../../components/common/Card";
import DashboardHeader from "../dashboard_header/DashboardHeader";
import { messages } from "../data/messages";
import "../../../styles/patient_dashboard.css";

function Inbox() {
  return (
    <div className="pd-inbox-page">
      <DashboardHeader />
      <main className="pd-inbox-content">
        <div className="pd-inbox-title"><div><span>Patient communications</span><h1>Inbox</h1><p>Stay connected with your care team in one dedicated place.</p></div></div>
        <Card className="pd-inbox-card">
          <section className="pd-inbox-list" aria-label="Doctor conversations">
            <div className="pd-section-heading"><h2>Conversations</h2><span>{messages.reduce((total, message) => total + message.unread, 0)} unread</span></div>
            <label className="pd-message-search"><FiSearch /><input type="search" placeholder="Search conversations" /></label>
            <div className="pd-inbox-threads">{messages.map((message, index) => <button className={`pd-inbox-thread ${index === 0 ? "is-selected" : ""}`} type="button" key={message.id}><img src={message.image} alt={message.doctor} /><span><strong>{message.doctor}</strong><small>{message.preview}</small></span><time>{message.time}{message.unread > 0 && <b>{message.unread}</b>}</time></button>)}</div>
          </section>
          <section className="pd-conversation" aria-label="Selected conversation">
            <header><div><FiMessageCircle /><span><strong>Dr. Sarah Mitchell</strong><small>Senior Cardiologist · Online</small></span></div></header>
            <div className="pd-conversation-body"><p className="pd-message-received">Your latest blood pressure readings look stable. Please continue your current medication plan.</p><p className="pd-message-sent">Thank you, Doctor. I will keep tracking my readings.</p></div>
            <label className="pd-compose"><input placeholder="Write a message..." /><button type="button" aria-label="Send message"><FiSend /></button></label>
          </section>
        </Card>
      </main>
    </div>
  );
}

export default Inbox;
