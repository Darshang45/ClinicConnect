import { FiPhoneCall, FiAlertTriangle } from "react-icons/fi";
import Modal from "./Modal";
import { HOSPITAL_EMERGENCY_CONFIG } from "../../constants/emergencyConfig";

function EmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={HOSPITAL_EMERGENCY_CONFIG.title}
      className="hm-modal"
    >
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#fde8e8",
            color: "#ba1a1a",
            display: "grid",
            placeItems: "center",
            fontSize: "26px",
          }}
        >
          <FiAlertTriangle />
        </div>

        <div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", color: "var(--pd-text, #191c1c)" }}>
            {HOSPITAL_EMERGENCY_CONFIG.hospitalName}
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--pd-muted, #536052)" }}>
            {HOSPITAL_EMERGENCY_CONFIG.description}
          </p>
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderRadius: "14px",
            background: "#fff8f7",
            border: "1px dashed rgba(186, 26, 26, 0.3)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <small style={{ display: "block", color: "#536052", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Emergency Helpline Number
          </small>
          <strong style={{ fontSize: "28px", color: "#ba1a1a", display: "block", marginTop: "4px" }}>
            {HOSPITAL_EMERGENCY_CONFIG.displayNumber}
          </strong>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          <button
            type="button"
            className="pd-profile-edit"
            onClick={onClose}
            style={{ flex: 1, minHeight: "44px", borderRadius: "10px", cursor: "pointer" }}
          >
            Cancel
          </button>
          <a
            href={`tel:${HOSPITAL_EMERGENCY_CONFIG.number}`}
            className="pd-profile-save"
            style={{
              flex: 1.5,
              minHeight: "44px",
              borderRadius: "10px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              textDecoration: "none",
              background: "#ba1a1a",
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <FiPhoneCall />
            Call Hospital
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default EmergencyModal;
