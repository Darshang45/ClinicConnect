import { useState, useEffect, useCallback, useRef } from "react";
import { FiCalendar, FiClock, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import doctorDefault from "../../../assets/images/doctors/doctor-1.jpg";
import { getPatientAppointments, cancelPatientAppointment } from "../../../services/patientService";
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

function UpcomingAppointments({ nextAppointment, loading: initialLoading, onRefresh, isDedicatedPage = false, highlightAppointmentId = "" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(isDedicatedPage ? "" : "Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeHighlightId, setActiveHighlightId] = useState("");
  const appointmentRows = useRef(new Map());

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPatientAppointments({
        status: activeTab,
        search: searchQuery,
      });
      if (res?.success && Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setActiveHighlightId(highlightAppointmentId || "");
  }, [highlightAppointmentId]);

  useEffect(() => {
    if (!activeHighlightId) return undefined;

    const row = appointmentRows.current.get(String(activeHighlightId));
    if (!row) return undefined;

    row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    const timeoutId = window.setTimeout(() => {
      setActiveHighlightId("");
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [activeHighlightId, appointments]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      setCancellingId(appointmentId);
      await cancelPatientAppointment(appointmentId, "Cancelled by patient from dashboard");
      fetchAppointments();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleReschedule = (appointmentId) => {
    navigate("/patient/reschedule", {
      state: { appointmentId },
    });
  };

  return (
    <Card className="pd-upcoming" id="appointments">
      <div className="pd-section-heading" style={{ flexWrap: "wrap", gap: "12px" }}>
        <h2>Appointments</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", width: "100%" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FiSearch style={{ position: "absolute", left: "10px", color: "var(--on-surface-variant)" }} />
            <input
              type="text"
              placeholder="Search doctor, dept, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: "32px",
                paddingRight: "12px",
                paddingTop: "6px",
                paddingBottom: "6px",
                borderRadius: "16px",
                border: "1px solid var(--outline-variant)",
                background: "var(--surface-container-low)",
                fontSize: "13px",
                color: "var(--on-surface)",
              }}
            />
          </div>
          <div className="pd-history-tabs" style={{ display: "flex", gap: "6px" }}>
            {["Upcoming", "Completed", "Cancelled"].map((tab) => (
              <span
                key={tab}
                className={activeTab === tab ? "is-active" : ""}
                style={{ cursor: "pointer", padding: "4px 12px", borderRadius: "16px" }}
                onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
              >
                {tab}
              </span>
            ))}
          </div>
          {isDedicatedPage ? (
            <span
              style={{ fontSize: "13px", color: "var(--primary)", cursor: "pointer", marginLeft: "auto" }}
              onClick={() => {
                setActiveTab("");
                setSearchQuery("");
              }}
            >
              See all
            </span>
          ) : (
            <Link to="/patient/appointments" style={{ fontSize: "13px", marginLeft: "auto" }}>
              See all
            </Link>
          )}
        </div>
      </div>

      <div className="pd-appointment-table-wrap">
        <table className="pd-appointment-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--on-surface-variant)" }}>
                  Loading appointments...
                </td>
              </tr>
            ) : appointments.length > 0 ? (
              appointments.map((app) => (
                <tr
                  key={app.appointmentId}
                  ref={(element) => {
                    const appointmentId = String(app.appointmentId);
                    if (element) appointmentRows.current.set(appointmentId, element);
                    else appointmentRows.current.delete(appointmentId);
                  }}
                  className={
                    String(app.appointmentId) === String(activeHighlightId)
                      ? "pd-appointment-highlight"
                      : ""
                  }
                >
                  <td>
                    <div className="pd-doctor-cell">
                      <img src={doctorDefault} alt={app.doctor} />
                      <span>
                        <strong>{app.doctor}</strong>
                        <small>{app.specialization || "Specialist"}</small>
                      </span>
                    </div>
                  </td>
                  <td>{app.department}</td>
                  <td>
                    <strong>{formatDate(app.appointmentStart)}</strong>
                    <small>
                      <FiClock /> {formatTime(app.appointmentStart)}
                    </small>
                  </td>
                  <td>
                    <span className="pd-status">{app.status}</span>
                    {app.tokenNumber && (
                      <small style={{ display: "block", color: "var(--on-surface-variant)" }}>
                        Token #{app.tokenNumber}
                      </small>
                    )}
                  </td>
                  <td>
                    <div className="pd-table-actions">
                      {app.status !== "Completed" && app.status !== "Cancelled" && (
                        <>
                          <Button className="pd-table-button" onClick={() => handleReschedule(app.appointmentId)}>
                            Reschedule
                          </Button>
                          <Button
                            className="pd-table-link"
                            disabled={cancellingId === app.appointmentId}
                            onClick={() => handleCancel(app.appointmentId)}
                          >
                            {cancellingId === app.appointmentId ? "Cancelling..." : "Cancel"}
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--on-surface-variant)" }}>
                  No {activeTab ? activeTab.toLowerCase() : ""} appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pd-appointment-mobile-note">
        <FiCalendar /> Appointment reminders are enabled.
      </div>
    </Card>
  );
}

export default UpcomingAppointments;
