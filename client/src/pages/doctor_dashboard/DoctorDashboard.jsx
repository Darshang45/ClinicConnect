import DashboardHeader from "./dashboard_header/DashboardHeader";
import StatsCards from "./dashboard_stats/StatsCards";
import TodayQueue from "./today_queue/TodayQueue";
import PatientSearch from "./patient_search/PatientSearch";
import PatientWorkspace from "./patient_workspace/PatientWorkspace";
import ActionFooter from "./action_footer/ActionFooter";
import NextPatient from "./next_patient/NextPatient";
import "../../styles/doctor_dashboard.css";

function DoctorDashboard() {
  return (
    <div className="doctor-dashboard">
      <DashboardHeader />
      <main className="doc-dashboard-content">
        <StatsCards />
        <TodayQueue />
        <PatientSearch />
        <PatientWorkspace />
        <ActionFooter />
        <NextPatient />
      </main>
    </div>
  );
}

export default DoctorDashboard;
