import { useState, useEffect, useRef } from "react";
import { MdRefresh, MdMoreVert } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import {
  getDoctorsStatus,
  updateDoctorStatus,
} from "../../../services/receptionistservice";
import { getApiErrorMessage } from "../../../services/api";

export function DoctorCard({ doctor, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOffDuty = doctor.statusCode === "Off Duty";
  const isInConsultation = doctor.statusCode === "In Consultation";

  const handleToggleStatus = (newStatus) => {
    setMenuOpen(false);
    onStatusChange?.(doctor.id || doctor.doctorId, newStatus);
  };

  return (
    <Card className="rc-doctor-card" style={{ position: "relative" }}>
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 5,
        }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#6e7b6c",
            padding: "4px",
            borderRadius: "50%",
          }}
          aria-label="Doctor actions"
        >
          <MdMoreVert />
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              background: "#fff",
              border: "1px solid #bdcaba",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              minWidth: "140px",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            {isOffDuty ? (
              <button
                type="button"
                onClick={() => handleToggleStatus("Available")}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#006b2c",
                }}
              >
                Mark Available
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleToggleStatus("Off Duty")}
                disabled={isInConsultation}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: isInConsultation ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: isInConsultation ? "#a0a0a0" : "#ba1a1a",
                }}
                title={isInConsultation ? "Cannot mark Off Duty while In Consultation" : ""}
              >
                Mark Off Duty
              </button>
            )}
          </div>
        )}
      </div>

      <div className="rc-doctor-photo">
        <img
          src={
            doctor.image ||
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
          }
          alt={doctor.name}
        />
        <i className={doctor.tone || "available"} />
      </div>

      <div>
        <h3>{doctor.name}</h3>
        <p>{doctor.department}</p>
      </div>

      <strong className={`rc-doctor-status ${doctor.tone || "available"}`}>
        {doctor.status}
      </strong>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "12px", color: "#3e4a3d" }}>
        <strong>{doctor.room || "Room 302"}</strong>
        <span style={{ fontSize: "11px", fontStyle: "italic" }}>
          {doctor.currentInfo}
        </span>
      </div>
    </Card>
  );
}

function DoctorAvailability() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDoctorAvailability = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDoctorsStatus();
      const docs = response.doctors || response.data || [];
      setDoctorsList(docs);
    } catch (err) {
      console.error("Failed to load doctor availability:", err);
      setError(getApiErrorMessage(err, "Failed to load doctor availability."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAvailability();
  }, []);

  const handleStatusChange = async (doctorId, newStatus) => {
    try {
      await updateDoctorStatus(doctorId, { status: newStatus });
      await fetchDoctorAvailability();
    } catch (err) {
      alert(getApiErrorMessage(err, "Failed to update doctor status."));
    }
  };

  return (
    <section className="rc-doctors-section" id="doctors">
      <div className="rc-section-heading rc-doctors-heading">
        <h2>Doctor Availability</h2>
        <Button
          className="rc-refresh-button"
          onClick={fetchDoctorAvailability}
          disabled={loading}
        >
          <MdRefresh className={loading ? "spin" : ""} />{" "}
          {loading ? "Refreshing..." : "Refresh Status"}
        </Button>
      </div>

      {error && <div className="rc-form-error mb-3">{error}</div>}

      <div className="rc-doctor-grid">
        {doctorsList.map((doctor) => (
          <DoctorCard
            doctor={doctor}
            key={doctor.id || doctor.doctorId || doctor.name}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </section>
  );
}

export default DoctorAvailability;
