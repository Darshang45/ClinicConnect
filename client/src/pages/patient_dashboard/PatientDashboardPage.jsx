import BackButton from "../../components/common/BackButton";
import Container from "../../components/common/Container";
import "../../styles/patient_dashboard.css";
import DashboardHeader from "./dashboard_header/DashboardHeader";

function PatientDashboardPage({ children }) {
  return (
    <Container className="patient-dashboard">
      <DashboardHeader />
      <main className="pd-page-content">
        {children}
        <BackButton className="pd-page-back" to="/patient/dashboard" />
      </main>
    </Container>
  );
}

export default PatientDashboardPage;
