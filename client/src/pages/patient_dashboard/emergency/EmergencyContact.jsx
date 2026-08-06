import { useState, useEffect } from "react";
import { FiAlertTriangle, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import EmergencyModal from "../../../components/common/EmergencyModal";
import { HOSPITAL_EMERGENCY_CONFIG } from "../../../constants/emergencyConfig";
import { getPatientProfile } from "../../../services/patientService";
import "../../../styles/patient_dashboard.css";

function EmergencyContact() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [patientEmergency, setPatientEmergency] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPatientProfile();
        const contact = res?.patient?.emergencyContact || res?.data?.emergencyContact;
        if (contact && (contact.name || contact.phone)) {
          setPatientEmergency(contact);
        }
      } catch (err) {
        console.error("Error fetching emergency profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const patientContactDisplay = patientEmergency?.name
    ? `${patientEmergency.name}${patientEmergency.relation ? ` (${patientEmergency.relation})` : ""}: ${patientEmergency.phone || ""}`
    : "Registered Profile Contact";

  const emergencyContacts = [
    { label: "Hospital emergency", value: HOSPITAL_EMERGENCY_CONFIG.displayNumber, icon: FiPhone },
    { label: "Primary doctor", value: "Available on Call", icon: FiUser },
    { label: "Patient emergency contact", value: patientContactDisplay, icon: FiPhone },
    {
      label: "Nearest hospital",
      value: "ClinicConnect Emergency Center",
      icon: FiMapPin,
    },
  ];

  return (
    <Card className="pd-emergency-contact" id="emergency-contact">
      <div className="pd-section-heading">
        <h2>Emergency Contact</h2>
        <FiAlertTriangle />
      </div>
      <div className="pd-emergency-list">
        <div className="pd-emergency-item">
          <FiPhone />
          <span>
            <small>Hospital emergency</small>
            <strong>{HOSPITAL_EMERGENCY_CONFIG.displayNumber}</strong>
          </span>
        </div>

        <div className="pd-emergency-item">
          <FiUser />
          <span>
            <small>Primary doctor</small>
            <strong>Available on Call</strong>
          </span>
        </div>

        <div className="pd-emergency-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiPhone />
            <small style={{ fontWeight: 600 }}>Patient Emergency Contact</small>
          </div>
          {patientEmergency?.name ? (
            <div style={{ paddingLeft: "24px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: "13px" }}>
              <span style={{ color: "var(--pd-muted, #536052)" }}>Name:</span>
              <strong>{patientEmergency.name}</strong>
              <span style={{ color: "var(--pd-muted, #536052)" }}>Relation:</span>
              <strong>{patientEmergency.relation || "N/A"}</strong>
              <span style={{ color: "var(--pd-muted, #536052)" }}>Phone:</span>
              <strong>{patientEmergency.phone || "N/A"}</strong>
            </div>
          ) : (
            <strong style={{ paddingLeft: "24px" }}>Registered Profile Contact</strong>
          )}
        </div>

        <div className="pd-emergency-item">
          <FiMapPin />
          <span>
            <small>Nearest hospital</small>
            <strong>ClinicConnect Emergency Center</strong>
          </span>
        </div>
      </div>
      <Button className="pd-emergency-call" onClick={() => setShowEmergencyModal(true)}>
        <FiPhone />
        Call emergency services
      </Button>
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </Card>
  );
}

export default EmergencyContact;
