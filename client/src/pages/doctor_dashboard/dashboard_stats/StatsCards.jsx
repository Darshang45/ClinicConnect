import Card from "../../../components/common/Card";
import "../../../styles/doctor_dashboard.css";

const headlineStats = [
  { label: "Completed", value: "14", tone: "primary" },
  { label: "Pending", value: "06" },
  { label: "Emergency", value: "02", icon: "emergency", tone: "emergency" },
];

const metricStats = [
  { label: "Today's Total", value: "22", detail: "+12%", tone: "primary" },
  { label: "Completed", value: "14", detail: "Good", tone: "badge" },
  { label: "Pending", value: "06" },
  { label: "Emergency", value: "02", detail: "dot", tone: "emergency" },
  { label: "Monthly Patients", value: "128", detail: "/ 412", tone: "muted" },
  { label: "Unread", value: "04", detail: "4", tone: "unread" },
];

function HeadlineCard({ stat }) {
  return (
    <Card className={`doc-headline-card ${stat.tone || ""}`}>
      <p>{stat.label}</p>
      <div className="doc-stat-value">
        {stat.icon && <span className="material-symbols-outlined">{stat.icon}</span>}
        <strong>{stat.value}</strong>
      </div>
    </Card>
  );
}

function MetricCard({ stat }) {
  return (
    <Card className="doc-metric-card">
      <p>{stat.label}</p>
      <div className="doc-metric-value">
        <strong>{stat.value}</strong>
        {stat.detail === "dot" && <span className="doc-emergency-dot" />}
        {stat.detail && stat.detail !== "dot" && <span className={`doc-metric-detail ${stat.tone}`}>{stat.detail}</span>}
      </div>
    </Card>
  );
}

function StatsCards() {
  return (
    <>
      <section className="doc-stats-banner" aria-label="Daily patient overview" id="home">
        <div className="doc-welcome-banner">
          <div>
            <h1>Welcome Back, Dr. Julianne Moore</h1>
            <p>You have a busy morning ahead with 4 patients waiting in the queue.</p>
          </div>
        </div>
        <div className="doc-headline-stats">
          {headlineStats.map((stat) => <HeadlineCard key={stat.label} stat={stat} />)}
        </div>
      </section>

      <section className="doc-metric-stats" aria-label="Dashboard statistics">
        {metricStats.map((stat) => <MetricCard key={stat.label} stat={stat} />)}
      </section>
    </>
  );
}

export default StatsCards;
