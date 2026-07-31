import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const formatTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
  });

function DashboardHero() {
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className="hero-banner full-span">
      <div>
        <h2>Welcome Back, {user.shortName}</h2>
        <p>
          Clinic Connect Central Operations is running smoothly. 14 pending lab
          approvals require your signature.
        </p>
      </div>
      <div className="hero-meta">
        <div className="hero-pill">
          <span className="material-symbols-outlined" aria-hidden="true">
            calendar_today
          </span>
          <span>{formatDate(now)}</span>
        </div>
        <div className="hero-pill">
          <span className="material-symbols-outlined" aria-hidden="true">
            schedule
          </span>
          <span>{formatTime(now)}</span>
        </div>
      </div>
      <div className="hero-background-icon" aria-hidden="true">
        <span className="material-symbols-outlined">medical_information</span>
      </div>
    </section>
  );
}

export default DashboardHero;
