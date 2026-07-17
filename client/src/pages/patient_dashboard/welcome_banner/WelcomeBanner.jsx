import { FiAlertTriangle, FiCalendar } from "react-icons/fi";
import Button from "../../../components/common/Button";
import "../../../styles/patient_dashboard.css";

function WelcomeBanner() {
  return <section className="pd-welcome" id="dashboard"><div><h1>Good Morning, Atharva</h1><p>Thursday, October 24, 2024 <span>•</span> Your health vitals are looking stable today.</p></div><div className="pd-welcome-actions"><Button className="pd-action-primary"><FiCalendar />Book Appointment</Button><Button className="pd-action-emergency"><FiAlertTriangle />Emergency</Button></div></section>;
}

export default WelcomeBanner;
