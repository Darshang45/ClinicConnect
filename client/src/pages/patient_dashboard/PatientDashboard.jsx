import Container from "../../components/common/Container";
import "../../styles/patient_dashboard.css";
import AppointmentHistory from "./appointment_history/AppointmentHistory";
import UpcomingAppointments from "./appointments/UpcomingAppointments";
import DashboardHeader from "./dashboard_header/DashboardHeader";
import EmergencyContact from "./emergency/EmergencyContact";
import HealthMetrics from "./health_metrics/HealthMetrics";
import HealthSummary from "./health_summary/HealthSummary";
import LabReports from "./lab_reports/LabReports";
import MedicalRecords from "./medical_records/MedicalRecords";
import Prescriptions from "./prescriptions/Prescriptions";
import QuickActions from "./quick_actions/QuickActions";
import WelcomeBanner from "./welcome_banner/WelcomeBanner";

function PatientDashboard() {
  return (
    <Container className="patient-dashboard">
      <DashboardHeader />
      <WelcomeBanner />
      <HealthSummary />
      <UpcomingAppointments />
      <AppointmentHistory />
      <MedicalRecords />
      <Prescriptions />
      <LabReports />
      <HealthMetrics />
      <QuickActions />
      <EmergencyContact />
    </Container>
  );
}

export default PatientDashboard;
