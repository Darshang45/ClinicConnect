import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/common/Container";
import "../../styles/patient_dashboard.css";
import usePatientDashboard from "../../hooks/usePatientDashboard";
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
import UploadReportModal from "../doctor_dashboard/diagnostic_reports/UploadReportModal";

function PatientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dashboardData, loading, refetch } = usePatientDashboard();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [highlightAppointmentId] = useState(
    () => location.state?.highlightAppointmentId || "",
  );

  useEffect(() => {
    if (!location.state?.highlightAppointmentId) return;

    const { highlightAppointmentId: _highlightAppointmentId, ...remainingState } = location.state;
    navigate(location.pathname, {
      replace: true,
      state: Object.keys(remainingState).length ? remainingState : null,
    });
  }, [location.pathname, location.state, navigate]);

  return (
    <Container className="patient-dashboard">
      <DashboardHeader />
      <WelcomeBanner patientName={dashboardData?.patientName} />
      <HealthSummary stats={dashboardData?.stats} bloodGroup={dashboardData?.bloodGroup} />
      <UpcomingAppointments
        nextAppointment={dashboardData?.nextAppointment}
        loading={loading}
        onRefresh={refetch}
        highlightAppointmentId={highlightAppointmentId}
      />
      <AppointmentHistory />
      <MedicalRecords />
      <Prescriptions />
      <LabReports />
      <HealthMetrics />
      <QuickActions onUploadReport={() => setShowUploadModal(true)} />
      <EmergencyContact />

      {showUploadModal && (
        <UploadReportModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={() => {
            refetch();
          }}
        />
      )}
    </Container>
  );
}

export default PatientDashboard;
