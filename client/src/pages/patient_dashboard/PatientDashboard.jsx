import { useState } from "react";
import Container from "../../components/common/Container";
import "../../styles/patient_dashboard.css";
import AppointmentHistory from "./appointment_history/AppointmentHistory";
import UpcomingAppointments from "./appointments/UpcomingAppointments";
import BillingInsurance from "./billing/BillingInsurance";
import DashboardHeader from "./dashboard_header/DashboardHeader";
import DoctorDirectory from "./doctor_directory/DoctorDirectory";
import EmergencyContact from "./emergency/EmergencyContact";
import HealthMetrics from "./health_metrics/HealthMetrics";
import HealthSummary from "./health_summary/HealthSummary";
import LabReports from "./lab_reports/LabReports";
import MedicalRecords from "./medical_records/MedicalRecords";
import PatientProfile from "./profile/PatientProfile";
import Prescriptions from "./prescriptions/Prescriptions";
import QuickActions from "./quick_actions/QuickActions";
import WelcomeBanner from "./welcome_banner/WelcomeBanner";

const initialPatient = {
  id: "PT-1001",
  name: "Atharva Srivastava",
  age: "28 years",
  gender: "Male",
  bloodGroup: "O+",
  height: "178 cm",
  weight: "72 kg",
  allergies: "No known allergies",
  chronicDiseases: "Hypertension",
  emergencyContact: "Ananya Srivastava",
  insurance: "CareSecure Health",
  phone: "",
  email: "",
  address: "",
  doctor: "",
  symptoms: "",
};

function PatientDashboard() {
  const [patient, setPatient] = useState(initialPatient);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const toggleProfileEditing = () => {
    setIsProfileEditing((isOpen) => !isOpen);
  };

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
      <BillingInsurance />
      <HealthMetrics />
      <DoctorDirectory />
      <QuickActions />
      <EmergencyContact />
      <PatientProfile
        isEditing={isProfileEditing}
        isReceptionPanel={false}
        onClose={isProfileEditing ? toggleProfileEditing : undefined}
        onToggleEdit={toggleProfileEditing}
        onUpdate={setPatient}
        patient={patient}
      />
    </Container>
  );
}

export default PatientDashboard;
