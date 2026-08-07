import { useEffect, useRef, useState } from "react";

import DashboardHeader from "./dashboard_header/DashboardHeader";
import StatsCards from "./dashboard_stats/StatsCards";
import TodayQueue from "./today_queue/TodayQueue";
import PatientSearch from "./patient_search/PatientSearch";
import PatientWorkspace from "./patient_workspace/PatientWorkspace";
import ActionFooter from "./action_footer/ActionFooter";
import NextPatient from "./next_patient/NextPatient";
import DoctorChatPanel from "./chat/DoctorChatPanel";

import {
  getDoctorDashboard,
  getAppointmentDetails,
  getPatientRecord,
} from "../../services/doctorService";

import "../../styles/doctor_dashboard.css";

function DoctorDashboard() {
  const [openPanel, setOpenPanel] = useState(null);

  const chatButtonRef = useRef(null);
  const chatPanelRef = useRef(null);

  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);

  const [dashboardData, setDashboardData] = useState(null);

  const [selectedQueueAppointment, setSelectedQueueAppointment] =
    useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [patientRecord, setPatientRecord] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // =====================================
  // Dashboard
  // =====================================

  const fetchDashboard = async (keepAppointmentId = null) => {
    try {
      setLoading(true);

      const data = await getDoctorDashboard();

      setDashboardData(data);

      const queue = data?.todayQueue || [];

      if (queue.length === 0) {
        setSelectedAppointment(null);
setSelectedQueueAppointment(null);
setPatientRecord(null);
        return data;
      }

      let appointmentToSelect = null;

      // If we're refreshing after an action, try to keep the same
      // appointment only if it's still active.
      if (keepAppointmentId) {
        appointmentToSelect = queue.find(
          (appointment) =>
            appointment.appointmentId === keepAppointmentId &&
            ["Scheduled", "Checked-In", "In Consultation"].includes(
              appointment.status,
            ),
        );
      }

      // Otherwise select the next active patient.
      if (!appointmentToSelect) {
        appointmentToSelect = queue.find((appointment) =>
          ["Scheduled", "Checked-In", "In Consultation"].includes(
            appointment.status,
          ),
        );
      }

      // If everyone is completed, clear the workspace.
      if (!appointmentToSelect) {
        setSelectedAppointment(null);
        setSelectedQueueAppointment(null);
        return data;
      }

      await handleSelectAppointment(appointmentToSelect);

      return data;
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================
  // Load Complete Appointment
  // =====================================

  const handleSelectAppointment = async (queueAppointment) => {
    if (!queueAppointment) return;

    try {
      setSelectedQueueAppointment(queueAppointment);

      const response = await getAppointmentDetails(
        queueAppointment.appointmentId,
      );

      setSelectedAppointment(response.appointment);
      setPatientRecord(null);
    } catch (error) {
      console.error(error);

      alert("Unable to load appointment.");
    }
  };

  // =====================================
  // Patient Search
  // =====================================

  // =====================================
// Patient Search
// =====================================

const handlePatientSearch = async (patient) => {
  try {
    setLoading(true);

    if (patient.hasAppointmentToday) {
      const response = await getAppointmentDetails(
        patient.appointmentId
      );

      setSelectedQueueAppointment({
        appointmentId: patient.appointmentId,
      });

      setPatientRecord(null);

      setSelectedAppointment(response.appointment);

    } else {

      const response = await getPatientRecord(
        patient._id
      );

      setSelectedQueueAppointment(null);

      setSelectedAppointment(null);

      setPatientRecord(response);

    }

  } catch (error) {

    console.error(error);

    alert("Unable to load patient.");

  } finally {

    setLoading(false);

  }
};

  // =====================================
  // Consultation Completed
  // =====================================

  const handleConsultationCompleted = async (appointmentId) => {
    await fetchDashboard(appointmentId);
  };

  // =====================================
  // Notification / Chat
  // =====================================

  useEffect(() => {
    if (!openPanel) return;

    const isInside = (ref, target) => ref.current?.contains(target);

    const closeWhenOutside = (event) => {
      const panelRef =
        openPanel === "chat" ? chatPanelRef : notificationPanelRef;

      const buttonRef =
        openPanel === "chat" ? chatButtonRef : notificationButtonRef;

      if (
        !isInside(panelRef, event.target) &&
        !isInside(buttonRef, event.target)
      ) {
        setOpenPanel(null);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpenPanel(null);
      }
    };

    document.addEventListener("mousedown", closeWhenOutside);

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);

      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openPanel]);

  // =====================================
  // Toggle Side Panels
  // =====================================

  const togglePanel = (panel) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  if (loading) {
    return <div className="doctor-dashboard-loading">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="doctor-dashboard-error">Failed to load dashboard.</div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <DashboardHeader
        openPanel={openPanel}
        onTogglePanel={togglePanel}
        chatButtonRef={chatButtonRef}
        notificationButtonRef={notificationButtonRef}
        notificationPanelRef={notificationPanelRef}
      />

      <div
        className={`doc-dashboard-layout ${
          openPanel === "chat" ? "is-chat-open" : ""
        }`}
      >
        <main className="doc-dashboard-content">
          <StatsCards stats={dashboardData?.stats} />

          <TodayQueue
            appointments={dashboardData?.todayQueue || []}
            selectedAppointment={selectedQueueAppointment}
            onSelectAppointment={handleSelectAppointment}
          />

          <PatientSearch onSelectPatient={handlePatientSearch} />

         <PatientWorkspace
  appointment={selectedAppointment}
  patientRecord={patientRecord}
  onConsultationCompleted={handleConsultationCompleted}
/>

          {/* <ActionFooter /> */}

          <NextPatient
            appointments={dashboardData?.todayQueue || []}
            currentAppointment={selectedQueueAppointment}
            onSelectAppointment={handleSelectAppointment}
          />
        </main>

        {openPanel === "chat" && <DoctorChatPanel panelRef={chatPanelRef} />}
      </div>
    </div>
  );
}

export default DoctorDashboard;
