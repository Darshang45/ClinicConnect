import ChatWorkspace from "../../components/common/chat/ChatWorkspace";
import DashboardHeader from "./dashboard_header/DashboardHeader";

import "../../styles/doctor_dashboard.css";
import "../../styles/doctor_chat.css";

function DoctorInbox() {
  return (
    <ChatWorkspace
      role="doctor"
      showHeader
      HeaderComponent={DashboardHeader}
    />
  );
}

export default DoctorInbox;
