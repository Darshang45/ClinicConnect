import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Button from "../../../components/common/Button";
import "../../../styles/reception_dashboard.css";

const formatDateTime = (date) => {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const calendarDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(date);

  return `Today is ${day}, ${calendarDate} • ${time}`;
};

function WelcomeSection({ onNewPatient }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(new Date()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="rc-welcome" id="welcome">
      <div>
        <h1>Good Morning, Elena</h1>
        <p>{formatDateTime(currentTime)}</p>
      </div>
      <div className="rc-welcome-actions">
        <Button className="rc-primary-action" onClick={onNewPatient}><MdAdd /> New Patient</Button>
      </div>
    </section>
  );
}

export default WelcomeSection;
