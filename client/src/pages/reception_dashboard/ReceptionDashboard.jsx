import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import "../../styles/reception_dashboard.css";
import Container from "../../components/common/Container";
import Modal from "../../components/common/Modal";
import AppointmentQueue from "./appointment_queue/AppointmentQueue";
import BroadcastCenter from "./broadcast/BroadcastCenter";
import DashboardHeader from "./dashboard_header/DashboardHeader";
import DoctorAvailability from "./doctor_availability/DoctorAvailability";
import PatientDetails from "./patient_details/PatientDetails";
import PatientRegistration from "./patient_registration/PatientRegistration";
import QuickActions from "./quick_actions/QuickActions";
import ReceptionChatPanel from "./dashboard_header/ReceptionChatPanel";
import ReceptionBilling from "./billing/ReceptionBilling";
import StatsCards from "./stats/StatsCards";
import WalkInList from "./walkins/WalkInList";
import WelcomeSection from "./welcome/WelcomeSection";
import initialAppointments from "./data/appointments";
import initialPatient from "./data/patient";
import initialWalkIns from "./data/walkins";
import PatientProfile from "../patient_dashboard/profile/PatientProfile";

const createAppointment = (patient) => ({
  time: "New",
  waitTime: "JUST REGISTERED",
  initials: `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase(),
  patient: patient.name,
  patientId: `#${patient.id}`,
  doctor: patient.doctor,
  reason: "New Registration",
  status: patient.appointmentStatus,
  statusTone: "waiting",
});

const createWalkIn = (patient) => ({
  priority: "Low",
  patient: patient.name,
  reason: patient.symptoms,
  waitTime: "Waiting now",
  doctor: `Assigned: ${patient.doctor}`,
  action: "Quick Intake",
  actionStyle: "outline",
});

function ReceptionDashboard() {
  const [openPanel, setOpenPanel] = useState(null);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(initialPatient);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [walkIns, setWalkIns] = useState(initialWalkIns);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isInboxOpen = location.pathname === "/reception/inbox";
  const isBillingOpen = location.pathname === "/reception/billing";

  useEffect(() => {
    if (!openPanel) return undefined;

    const closeWhenOutside = (event) => {
      const isInsidePanel = notificationPanelRef.current?.contains(event.target);
      const isInsideButton = notificationButtonRef.current?.contains(event.target);

      if (!isInsidePanel && !isInsideButton) setOpenPanel(null);
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

  const scrollToRegistration = () => {
    document.getElementById("registration")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDoctorAvailability = () => {
    const target = document.querySelector("#doctors");
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
  };

  const togglePatientProfile = () => {
    setShowPatientProfile((isOpen) => !isOpen);
  };

  const registerPatient = (patientData) => {
    const id = `PN-${String(Date.now()).slice(-6)}`;
    const patient = {
      id,
      ...patientData,
      name: `${patientData.firstName} ${patientData.lastName}`,
      appointmentStatus: "Waiting",
    };

    setAppointments((currentAppointments) => [createAppointment(patient), ...currentAppointments]);
    setWalkIns((currentWalkIns) => [createWalkIn(patient), ...currentWalkIns]);
    setRegisteredPatient(patient);
  };

  return (
    <div className="reception-dashboard">
      <DashboardHeader
        openPanel={openPanel}
        onTogglePanel={togglePanel}
        notificationButtonRef={notificationButtonRef}
        notificationPanelRef={notificationPanelRef}
      />
      {isInboxOpen ? <ReceptionChatPanel /> : isBillingOpen ? <ReceptionBilling /> : (
        <Container as="main" className="rc-dashboard-main">
          <WelcomeSection onNewPatient={scrollToRegistration} />
          <StatsCards />
          <AppointmentQueue appointments={appointments} />
          <div className="rc-dashboard-grid rc-walkin-actions" id="booking">
            <WalkInList walkIns={walkIns} />
            <QuickActions
              onCheckAvailability={scrollToDoctorAvailability}
              onCollectBill={() => navigate("/reception/billing")}
            />
          </div>
          <div id="registration">
            <PatientRegistration onRegister={registerPatient} />
          </div>
          <PatientDetails
            onEditProfile={togglePatientProfile}
            onSelectPatient={(patient) => {
              setSelectedPatient(patient);
              setShowPatientProfile(false);
            }}
            selectedPatient={selectedPatient}
          />
          {showPatientProfile && <PatientProfile onClose={togglePatientProfile} patient={selectedPatient} onUpdate={setSelectedPatient} />}
          <DoctorAvailability />
          <BroadcastCenter />
        </Container>
      )}
      <Modal
        className="rc-modal rc-success-modal"
        isOpen={Boolean(registeredPatient)}
        onClose={() => setRegisteredPatient(null)}
        overlayClassName="rc-modal-backdrop"
        title="Patient registered"
      >
        <p>{registeredPatient?.firstName} has been added to the appointment queue.</p>
        <Button className="rc-modal-submit" onClick={() => setRegisteredPatient(null)}>Done</Button>
      </Modal>
    </div>
  );
}

export default ReceptionDashboard;
