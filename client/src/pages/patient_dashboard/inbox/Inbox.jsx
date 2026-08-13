import ChatWorkspace from "../../../components/common/chat/ChatWorkspace";
import DashboardHeader from "../dashboard_header/DashboardHeader";
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
        <ChatWorkspace role="patient" />
      </main>
    </div>
  );
}

export default Inbox;
