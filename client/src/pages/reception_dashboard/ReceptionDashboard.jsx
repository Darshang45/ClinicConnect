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
import initialPatient from "./data/patient";
import PatientProfile from "../patient_dashboard/profile/PatientProfile";
import {
  getReceptionistDashboard,
  getTodayAppointments,
  getPendingCheckIns,
  getTodayWalkIns,
  getQueue,
  checkInPatient,
  cancelAppointment,
  createWalkInAppointment,
} from "../../services/receptionistservice";

import { getApiErrorMessage } from "../../services/api";
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
  const [appointments, setAppointments] = useState([]);
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(initialPatient);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [walkIns, setWalkIns] = useState([]);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isInboxOpen = location.pathname === "/reception/inbox";
  const isBillingOpen = location.pathname === "/reception/billing";
  const [pendingCheckIns, setPendingCheckIns] = useState([]);
  const [queue, setQueue] = useState([]);
  const [walkInLoading, setWalkInLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todayAppointments: 0,
    checkedInPatients: 0,
    pendingCheckIns: 0,
    completedToday: 0,
    walkInsToday: 0,
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  useEffect(() => {
    if (!openPanel) return undefined;

    const closeWhenOutside = (event) => {
      const isInsidePanel = notificationPanelRef.current?.contains(
        event.target,
      );
      const isInsideButton = notificationButtonRef.current?.contains(
        event.target,
      );

      if (!isInsidePanel && !isInsideButton) setOpenPanel(null);
    };
    const closeOnEscape = (event) =>
      event.key === "Escape" && setOpenPanel(null);

    document.addEventListener("mousedown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openPanel]);

  const togglePanel = (panel) => {
    setOpenPanel((currentPanel) => (currentPanel === panel ? null : panel));
  };

  const scrollToRegistration = () => {
    document
      .getElementById("registration")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDoctorAvailability = () => {
    const target = document.querySelector("#doctors");
    if (target)
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
  };

  const togglePatientProfile = () => {
    setShowPatientProfile((isOpen) => !isOpen);
  };

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      setDashboardError("");

      const [
        dashboardResponse,
        appointmentsResponse,
        pendingResponse,
        walkInsResponse,
        queueResponse,
      ] = await Promise.all([
        getReceptionistDashboard(),
        getTodayAppointments({
          page: 1,
          limit: 10,
        }),
        getPendingCheckIns({
          page: 1,
          limit: 10,
        }),
        getTodayWalkIns({
          page: 1,
          limit: 10,
        }),
        getQueue({
          page: 1,
          limit: 10,
        }),
      ]);

      // Dashboard statistics
      setDashboardStats(
        dashboardResponse.dashboard || {
          todayAppointments: 0,
          checkedInPatients: 0,
          pendingCheckIns: 0,
          completedToday: 0,
          walkInsToday: 0,
        },
      );

      // Today's appointments
      const appointmentList =
        appointmentsResponse.data || appointmentsResponse.appointments || [];

      setAppointments(appointmentList.map(mapAppointmentForUI));
      // Pending check-ins
      setPendingCheckIns(
        pendingResponse.data || pendingResponse.appointments || [],
      );

      // Today's walk-ins
      setWalkIns(walkInsResponse.data || walkInsResponse.walkIns || []);

      // Queue
      setQueue(queueResponse.data || queueResponse.queue || []);
    } catch (error) {
      console.error("Failed to load receptionist dashboard:", error);

      setDashboardError(
        getApiErrorMessage(error, "Failed to load receptionist dashboard."),
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const mapAppointmentForUI = (appointment) => {
    const patient = appointment.patient;
    const doctor = appointment.doctor;

    const fullName = patient?.fullName || "Unknown Patient";
    const nameParts = fullName.trim().split(" ");

    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
        : fullName.slice(0, 2);

    const appointmentDate = appointment.appointmentStart
      ? new Date(appointment.appointmentStart)
      : null;

    const time = appointmentDate
      ? appointmentDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "-";

    let statusTone = "waiting";

    if (appointment.status === "Completed") {
      statusTone = "completed";
    } else if (appointment.status === "Cancelled") {
      statusTone = "cancelled";
    } else if (appointment.status === "In Consultation") {
      statusTone = "consulting";
    } else if (appointment.status === "Checked-In") {
      statusTone = "waiting";
    }

    return {
      ...appointment,

      appointmentId: appointment._id || appointment.appointmentId,

      time,

      initials: initials.toUpperCase(),

      patient: fullName,

      patientId: patient?.patientId || "-",

      doctor: doctor?.user?.fullName
        ? `Dr. ${doctor.user.fullName}`
        : "Unknown Doctor",

      reason: appointment.reason || appointment.consultationType || "-",

      status: appointment.status,

      statusTone,

      waitTime: appointment.status === "Checked-In" ? "Checked-In" : "",
    };
  };

  const mapAppointment = (appointment) => {
    const patientName = appointment.patient?.fullName || "Unknown Patient";

    const nameParts = patientName.trim().split(" ");

    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
        : patientName.slice(0, 2);

    const statusMap = {
      Scheduled: "waiting",
      "Checked-In": "waiting",
      "In Consultation": "waiting",
      Completed: "completed",
      Cancelled: "cancelled",
      "No Show": "cancelled",
    };

    return {
      id: appointment._id,
      time: appointment.appointmentStart
        ? new Date(appointment.appointmentStart).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",

      waitTime: appointment.status === "Checked-In" ? "Checked-In" : "",

      initials: initials.toUpperCase(),

      patient: patientName,

      patientId: `#${appointment.patient?.patientId || "-"}`,

      doctor: appointment.doctor?.user?.fullName || "Unknown Doctor",

      reason: appointment.reason || "-",

      status: appointment.status,

      statusTone: statusMap[appointment.status] || "waiting",

      appointmentId: appointment._id,

      rawAppointment: appointment,
    };
  };

  const handleCheckIn = async (appointment) => {
    try {
      setDashboardLoading(true);
      setDashboardError("");

      await checkInPatient(appointment.appointmentId || appointment._id);

      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to check in patient:", error);

      setDashboardError(
        getApiErrorMessage(error, "Failed to check in patient."),
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleCancelAppointment = async (appointment) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the appointment for ${appointment.patient}?`,
    );

    if (!confirmed) return;

    try {
      setDashboardLoading(true);
      setDashboardError("");

      await cancelAppointment(appointment.appointmentId || appointment._id);

      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);

      setDashboardError(
        getApiErrorMessage(error, "Failed to cancel appointment."),
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  const [bookingExistingPatient, setBookingExistingPatient] = useState(null);
  const [bookingToast, setBookingToast] = useState("");

  const handleWalkInRegistration = async (walkInData) => {
    try {
      setWalkInLoading(true);

      const response = await createWalkInAppointment(walkInData);

      setRegisteredPatient(response.patient);
      setBookingToast("Appointment booked successfully");

      await fetchDashboardData();

      if (bookingExistingPatient) {
        setBookingExistingPatient(null);
        setTimeout(() => {
          document.getElementById("patient-details")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      setDashboardError(
        getApiErrorMessage(error, "Failed to create appointment."),
      );
    } finally {
      setWalkInLoading(false);
    }
  };

  return (
    <div className="reception-dashboard">
      <DashboardHeader
        openPanel={openPanel}
        onTogglePanel={togglePanel}
        notificationButtonRef={notificationButtonRef}
        notificationPanelRef={notificationPanelRef}
      />
      {isInboxOpen ? (
        <ReceptionChatPanel />
      ) : isBillingOpen ? (
        <ReceptionBilling />
      ) : (
        <Container as="main" className="rc-dashboard-main">
          <WelcomeSection onNewPatient={() => {
            setBookingExistingPatient(null);
            scrollToRegistration();
          }} />
          {dashboardLoading ? (
            <div className="text-center py-4">Loading dashboard...</div>
          ) : dashboardError ? (
            <div className="alert alert-danger">{dashboardError}</div>
          ) : (
            <StatsCards dashboard={dashboardStats} />
          )}
          <AppointmentQueue
            appointments={appointments}
            onCheckIn={handleCheckIn}
            onCancel={handleCancelAppointment}
          />
          <div className="rc-dashboard-grid rc-walkin-actions" id="booking">
            <WalkInList walkIns={walkIns} />
            <QuickActions
              onCheckAvailability={scrollToDoctorAvailability}
              onCollectBill={() => navigate("/reception/billing")}
            />
          </div>
          <PatientDetails
            onSelectPatient={(patient) => {
              setSelectedPatient(patient);
              setShowPatientProfile(false);
            }}
            onBookAppointment={(patient) => {
              setBookingExistingPatient(patient);
              scrollToRegistration();
            }}
            onPatientUpdated={(updated) => {
              setSelectedPatient(updated);
            }}
            selectedPatient={selectedPatient}
          />
          <div id="registration">
            <PatientRegistration
              onRegister={handleWalkInRegistration}
              existingPatient={bookingExistingPatient}
              onClearExistingPatient={() => setBookingExistingPatient(null)}
            />
          </div>
          {showPatientProfile && (
            <PatientProfile
              onClose={togglePatientProfile}
              patient={selectedPatient}
              onUpdate={setSelectedPatient}
            />
          )}
          <DoctorAvailability />
          <BroadcastCenter />
        </Container>
      )}
      <Modal
        className="rc-modal rc-success-modal"
        isOpen={Boolean(registeredPatient)}
        onClose={() => setRegisteredPatient(null)}
        overlayClassName="rc-modal-backdrop"
        title="Appointment Confirmed"
      >
        <p>
          {bookingToast || "Appointment booked successfully"} for{" "}
          {registeredPatient?.fullName || registeredPatient?.firstName}.
        </p>
        <Button
          className="rc-modal-submit"
          onClick={() => setRegisteredPatient(null)}
        >
          Done
        </Button>
      </Modal>
    </div>
  );
}

export default ReceptionDashboard;
