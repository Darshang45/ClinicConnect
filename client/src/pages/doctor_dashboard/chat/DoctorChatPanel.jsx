import Inbox from "../../../components/common/Inbox/Inbox";
import { doctorConversations } from "../data/communications";
import "../../../styles/doctor_dashboard.css";
import DashboardHeader from "../dashboard_header/DashboardHeader";

function DoctorChatPanel({ panelRef }) {
  return (
    
    <aside className="doc-inline-chat" ref={panelRef} aria-label="Doctor inbox">
      <DashboardHeader/>
      <Inbox
        className="doc-chat-workspace"
        threads={doctorConversations}
        conversationLabel="Inbox"
        subtitle="Patient communication · Online"
        receivedMessage="Thank you for the update. I will see you shortly in the consultation room."
        sentMessage="I have reviewed your message and will update your care plan today."
      />
    </aside>
  );
}

export default DoctorChatPanel;
