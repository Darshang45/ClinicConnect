import {
  MdCalendarMonth,
  MdDirectionsWalk,
  MdEmergency,
  MdHourglassEmpty,
  MdMedicalServices,
} from "react-icons/md";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import stats from "../data/stats";

const icons = {
  calendar: MdCalendarMonth,
  waiting: MdHourglassEmpty,
  walk: MdDirectionsWalk,
  doctor: MdMedicalServices,
  emergency: MdEmergency,
};

function StatsCards() {
  return (
    <section className="rc-stats-grid" aria-label="Today at a glance">
      {stats.map((stat) => {
        const Icon = icons[stat.icon];

        return (
          <Card className={`rc-stat-card rc-stat-${stat.tone}`} key={stat.label}>
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
