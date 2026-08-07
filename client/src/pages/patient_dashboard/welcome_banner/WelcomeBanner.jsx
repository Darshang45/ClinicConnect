import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import EmergencyModal from "../../../components/common/EmergencyModal";
import "../../../styles/patient_dashboard.css";
import useAuth from "../../../hooks/useAuth";

function WelcomeBanner({ patientName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const displayName = patientName || user?.fullName;
  const firstName = displayName ? displayName.split(" ")[0] : "there";

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the state so the message doesn't persist on refresh
      window.history.replaceState({}, document.title);
      const timer = window.setTimeout(() => setSuccessMessage(""), 5000);
      return () => window.clearTimeout(timer);
    }
  }, [location.state?.successMessage]);

  return (
    <section className="pd-welcome" id="dashboard">
      <div>
        <h1>Good Morning, {firstName}</h1>
        <p>
          Your health vitals are looking stable today.
        </p>
      </div>
      <div className="pd-welcome-actions">
        <Button
          className="pd-action-primary"
          onClick={() => navigate("/patient/book")}
        >
          <FiCalendar />
          Book Appointment
        </Button>
        <Button
          className="pd-action-emergency"
          onClick={() => setShowEmergencyModal(true)}
        >
          <FiAlertTriangle />
          Emergency
        </Button>
      </div>
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
      {successMessage && (
        <div
          className="pd-success-toast"
          role="status"
          aria-live="polite"
        >
          <FiCheckCircle />
          <span>{successMessage}</span>
        </div>
      )}
    </section>
  );
}

export default WelcomeBanner;
