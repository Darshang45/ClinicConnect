import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientDashboardPage from "../PatientDashboardPage";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import AppointmentForm from "../../../components/common/AppointmentForm";
import {
  getPatientAppointmentDetails,
  reschedulePatientAppointment,
} from "../../../services/patientService";
import { getAvailableSlots } from "../../../services/appointmentService";
import "../../../styles/patient_dashboard.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function RescheduleAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.state?.appointmentId;

  const [appointment, setAppointment] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [consultationType, setConsultationType] = useState("Offline");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch original appointment details
  useEffect(() => {
    if (!appointmentId) {
      setFetching(false);
      setFetchError("No appointment selected for rescheduling. Please select an active appointment from your dashboard.");
      return;
    }

    const loadDetails = async () => {
      try {
        setFetching(true);
        setFetchError("");
        const res = await getPatientAppointmentDetails(appointmentId);
        if (res?.success && res.appointment) {
          setAppointment(res.appointment);
          setConsultationType(res.appointment.consultationType || "Offline");
          setReason(res.appointment.reason || "");
          setSymptoms(
            Array.isArray(res.appointment.symptoms)
              ? res.appointment.symptoms.join(", ")
              : res.appointment.symptoms || ""
          );
        } else {
          setFetchError("Failed to retrieve appointment details.");
        }
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setFetchError(
          err?.response?.data?.message || "Appointment not found or access denied."
        );
      } finally {
        setFetching(false);
      }
    };

    loadDetails();
  }, [appointmentId]);

  // Load available time slots when date changes
  useEffect(() => {
    if (!appointment?.doctorId || !appointmentDate) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        const res = await getAvailableSlots(appointment.doctorId, appointmentDate);
        setSlots(res?.slots || []);
      } catch (err) {
        console.error("Error loading slots:", err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [appointment?.doctorId, appointmentDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "appointmentDate") {
      setAppointmentDate(value);
      setAppointmentTime("");
    } else if (name === "appointmentTime") {
      setAppointmentTime(value);
    } else if (name === "consultationType") {
      setConsultationType(value);
    } else if (name === "reason") {
      setReason(value);
    } else if (name === "symptoms") {
      setSymptoms(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId || !appointmentDate || !appointmentTime) {
      alert("Please select a new date and time slot.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reschedulePatientAppointment(appointmentId, {
        appointmentDate,
        appointmentTime,
        consultationType,
        reason,
        symptoms,
      });

      alert("Appointment rescheduled successfully!");
      navigate("/patient/dashboard");
    } catch (err) {
      console.error("Failed to reschedule:", err);
      alert(err?.response?.data?.message || "Failed to reschedule appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <PatientDashboardPage>
        <Card style={{ padding: "32px", textAlign: "center" }}>
          <p style={{ color: "var(--on-surface-variant)" }}>Loading appointment details...</p>
        </Card>
      </PatientDashboardPage>
    );
  }

  if (fetchError || !appointment) {
    return (
      <PatientDashboardPage>
        <Card style={{ padding: "32px", maxWidth: "600px", margin: "24px auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: "16px", color: "var(--on-surface)" }}>Reschedule Appointment</h2>
          <p style={{ color: "var(--on-surface-variant)", marginBottom: "24px" }}>
            {fetchError || "Invalid appointment request."}
          </p>
          <Button onClick={() => navigate("/patient/dashboard")}>
            Back to Dashboard
          </Button>
        </Card>
      </PatientDashboardPage>
    );
  }

  const formData = {
    departmentId: appointment.departmentId,
    doctorId: appointment.doctorId,
    appointmentDate,
    appointmentTime,
    consultationType,
    reason,
    symptoms,
  };

  return (
    <PatientDashboardPage>
      <section className="appointment" style={{ padding: "0" }}>
        <div className="appointment-inner">
          <div className="appointment-card glass-card">
            <div className="appointment-header">
              <h2>Reschedule Appointment</h2>
              <p>Select a new date and time slot for your appointment.</p>
            </div>

            {/* Currently Scheduled Info Badge */}
            <div
              style={{
                background: "var(--surface-container-low)",
                padding: "14px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: "1px solid var(--outline-variant)",
                fontSize: "13px",
                color: "var(--on-surface-variant)",
              }}
            >
              <strong>Currently Scheduled:</strong> {formatDate(appointment.appointmentStart)} at {formatTime(appointment.appointmentStart)}
            </div>

            <AppointmentForm
              mode="reschedule"
              formData={formData}
              handleChange={handleChange}
              slots={slots}
              loadingSlots={loadingSlots}
              isSubmitting={isSubmitting}
              isAuthenticated={true}
              onSubmit={handleSubmit}
              doctorName={`${appointment.doctorName} (${appointment.specialization || "Specialist"})`}
              departmentName={appointment.departmentName}
              submitButtonText="Confirm Reschedule"
            />
          </div>
        </div>
      </section>
    </PatientDashboardPage>
  );
}

export default RescheduleAppointment;
