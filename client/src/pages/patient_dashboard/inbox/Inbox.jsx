import ConversationWorkspace from "../../../components/common/Inbox/Inbox";
import DashboardHeader from "../dashboard_header/DashboardHeader";
import { messages } from "../data/messages";
import "../../../styles/patient_dashboard.css";

function Inbox() {
  return (
    <div className="pd-inbox-page">
      <DashboardHeader />
      <main className="pd-inbox-content">
        <div className="pd-inbox-title">
          <div>
            <span>Patient communications</span>
            <h1>Inbox</h1>
            <p>Stay connected with your care team in one dedicated place.</p>
          </div>
        </div>
        <ConversationWorkspace
          threads={messages}
          conversationLabel="Conversations"
          subtitle="Senior Cardiologist · Online"
          receivedMessage="Your latest blood pressure readings look stable. Please continue your current medication plan."
          sentMessage="Thank you, Doctor. I will keep tracking my readings."
        />
      </main>
    </div>
  );
}

export default Inbox;
