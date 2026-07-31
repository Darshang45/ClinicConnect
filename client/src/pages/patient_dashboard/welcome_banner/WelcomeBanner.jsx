import { FiAlertTriangle, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import "../../../styles/patient_dashboard.css";

function WelcomeBanner() {
  const navigate = useNavigate();

  return (
    <section className="pd-welcome" id="dashboard">
      <div>
        <h1>Good Morning, Atharva</h1>
        <p>
          Thursday, October 24, 2024 <span>•</span> Your health vitals are
          looking stable today.
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
    </section>
  );
}

export default WelcomeBanner;
