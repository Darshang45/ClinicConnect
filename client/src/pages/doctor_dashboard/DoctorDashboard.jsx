import { useEffect, useRef, useState } from "react";
import DashboardHeader from "./dashboard_header/DashboardHeader";
import StatsCards from "./dashboard_stats/StatsCards";
import TodayQueue from "./today_queue/TodayQueue";
import PatientSearch from "./patient_search/PatientSearch";
import PatientWorkspace from "./patient_workspace/PatientWorkspace";
import ActionFooter from "./action_footer/ActionFooter";
import NextPatient from "./next_patient/NextPatient";
import DoctorChatPanel from "./chat/DoctorChatPanel";
import "../../styles/doctor_dashboard.css";

function DoctorDashboard() {
  const [openPanel, setOpenPanel] = useState(null);
  const chatButtonRef = useRef(null);
  const chatPanelRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);

  useEffect(() => {
    if (!openPanel) return undefined;

    const isInside = (ref, target) => ref.current?.contains(target);
    const closeWhenOutside = (event) => {
      const panelRef = openPanel === "chat" ? chatPanelRef : notificationPanelRef;
      const buttonRef = openPanel === "chat" ? chatButtonRef : notificationButtonRef;

      if (!isInside(panelRef, event.target) && !isInside(buttonRef, event.target)) {
        setOpenPanel(null);
      }
    };
    const closeOnEscape = (event) => event.key === "Escape" && setOpenPanel(null);

    document.addEventListener("mousedown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openPanel]);

  const togglePanel = (panel) => {
    setOpenPanel((currentPanel) => currentPanel === panel ? null : panel);
  };

  return (
    <div className="doctor-dashboard">
      <DashboardHeader
        openPanel={openPanel}
        onTogglePanel={togglePanel}
        chatButtonRef={chatButtonRef}
        notificationButtonRef={notificationButtonRef}
        notificationPanelRef={notificationPanelRef}
      />
      <div className={`doc-dashboard-layout ${openPanel === "chat" ? "is-chat-open" : ""}`}>
        <main className="doc-dashboard-content">
          <StatsCards />
          <TodayQueue />
          <PatientSearch />
          <PatientWorkspace />
          <ActionFooter />
          <NextPatient />
        </main>
        {openPanel === "chat" && <DoctorChatPanel panelRef={chatPanelRef} />}
      </div>
    </div>
  );
}

export default DoctorDashboard;
