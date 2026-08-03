import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import "../../../styles/patient_dashboard.css";
import useAuth from "../../../hooks/useAuth";

function WelcomeBanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const firstName = user?.fullName?.split(" ")[0] || "there";

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
        <Button className="pd-action-emergency">
          <FiAlertTriangle />
          Emergency
        </Button>
      </div>
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
