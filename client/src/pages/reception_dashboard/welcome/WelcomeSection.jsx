import { MdAdd, MdPersonSearch } from "react-icons/md";
import Button from "../../../components/common/Button";
import "../../../styles/reception_dashboard.css";

function WelcomeSection() {
  return (
    <section className="rc-welcome" id="welcome">
      <div>
        <h1>Good Morning, Elena</h1>
        <p>Today is Monday, Oct 24th • 08:45 AM</p>
      </div>
      <div className="rc-welcome-actions">
        <Button className="rc-primary-action"><MdAdd /> New Patient</Button>
        <Button className="rc-secondary-action"><MdPersonSearch /> Quick Check-in</Button>
      </div>
    </section>
  );
}

export default WelcomeSection;
