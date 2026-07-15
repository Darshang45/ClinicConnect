import "../../styles/reception_dashboard.css";
import Container from "../../components/common/Container";
import AppointmentQueue from "./appointment_queue/AppointmentQueue";
import BroadcastCenter from "./broadcast/BroadcastCenter";
import DashboardHeader from "./dashboard_header/DashboardHeader";
import DoctorAvailability from "./doctor_availability/DoctorAvailability";
import PatientDetails from "./patient_details/PatientDetails";
import PatientRegistration from "./patient_registration/PatientRegistration";
import QuickActions from "./quick_actions/QuickActions";
import StatsCards from "./stats/StatsCards";
import WalkInList from "./walkins/WalkInList";
import WelcomeSection from "./welcome/WelcomeSection";

function ReceptionDashboard() {
  return (
    <div className="reception-dashboard">
      <DashboardHeader />
      <Container as="main" className="rc-dashboard-main">
        <WelcomeSection />
        <StatsCards />
        <AppointmentQueue />
        <div className="rc-dashboard-grid rc-walkin-actions" id="booking">
          <WalkInList />
          <QuickActions />
        </div>
         <div id = "registration"> 
          <PatientRegistration />
        </div>
      
          <PatientDetails />
        <DoctorAvailability />
        <BroadcastCenter />
        
      </Container>
    </div>
  );
}

export default ReceptionDashboard;
