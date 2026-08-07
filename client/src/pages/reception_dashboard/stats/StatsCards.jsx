import {
  MdCalendarMonth,
  MdDirectionsWalk,
  MdHourglassEmpty,
  MdMedicalServices,
} from "react-icons/md";

import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

const icons = {
  calendar: MdCalendarMonth,
  waiting: MdHourglassEmpty,
  walk: MdDirectionsWalk,
  doctor: MdMedicalServices,
};

function StatsCards({ dashboard }) {
  const stats = [
    {
      label: "Today's Appointments",
      value: dashboard?.todayAppointments ?? 0,
      icon: "calendar",
      trend: "Today",
      tone: "blue",
    },
    {
      label: "Checked-In Patients",
      value: dashboard?.checkedInPatients ?? 0,
      icon: "waiting",
      trend: "Current",
      tone: "orange",
    },
    {
      label: "Pending Check-Ins",
      value: dashboard?.pendingCheckIns ?? 0,
      icon: "waiting",
      trend: "Waiting",
      tone: "yellow",
    },
    {
      label: "Completed Today",
      value: dashboard?.completedToday ?? 0,
      icon: "doctor",
      trend: "Completed",
      tone: "green",
    },
    {
      label: "Walk-ins Today",
      value: dashboard?.walkInsToday ?? 0,
      icon: "walk",
      trend: "Walk-in",
      tone: "purple",
    },
  ];

  return (
    <section
      className="rc-stats-grid"
      aria-label="Today at a glance"
    >
      {stats.map((stat) => {
        const Icon = icons[stat.icon];

        return (
          <Card
            className={`rc-stat-card rc-stat-${stat.tone}`}
            key={stat.label}
          >
            <div className="rc-stat-heading">
              <Icon />
              <span>{stat.trend}</span>
            </div>

            <p>{stat.label}</p>

            <strong>{stat.value}</strong>
          </Card>
        );
      })}
    </section>
  );
}

export default StatsCards;