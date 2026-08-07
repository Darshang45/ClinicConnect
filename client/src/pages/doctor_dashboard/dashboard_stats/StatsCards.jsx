import Card from "../../../components/common/Card";
import "../../../styles/doctor_dashboard.css";

function HeadlineCard({ stat }) {
  return (
    <Card className={`doc-headline-card ${stat.tone || ""}`}>
      <p>{stat.label}</p>

      <div className="doc-stat-value">
        {stat.icon && (
          <span className="material-symbols-outlined">
            {stat.icon}
          </span>
        )}

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

        {stat.detail && (
          <span className={`doc-metric-detail ${stat.tone || ""}`}>
            {stat.detail}
          </span>
        )}
      </div>
    </Card>
  );
}

function StatsCards({ stats }) {
  const dashboardStats = stats || {
    todayPatients: 0,
    completedConsultations: 0,
    pendingConsultations: 0,
    prescriptionsIssued: 0,
  };

  const headlineStats = [
    {
      label: "Completed",
      value: dashboardStats.completedConsultations,
      tone: "primary",
    },
    {
      label: "Pending",
      value: dashboardStats.pendingConsultations,
    },
  ];

  const metricStats = [
    {
      label: "Today's Patients",
      value: dashboardStats.todayPatients,
      tone: "primary",
    },
    {
      label: "Completed Consultations",
      value: dashboardStats.completedConsultations,
      detail: "Today",
      tone: "badge",
    },
    {
      label: "Pending Consultations",
      value: dashboardStats.pendingConsultations,
    },
    {
      label: "Prescriptions Issued",
      value: dashboardStats.prescriptionsIssued,
    },
  ];

  return (
    <>
      <section
        className="doc-stats-banner"
        aria-label="Daily patient overview"
        id="home"
      >
        <div className="doc-welcome-banner">
          <div>
            <h1>Welcome Back</h1>

            <p>
              You have{" "}
              <strong>{dashboardStats.pendingConsultations}</strong>{" "}
              pending consultations today.
            </p>
          </div>
        </div>

        <div className="doc-headline-stats">
          {headlineStats.map((stat) => (
            <HeadlineCard
              key={stat.label}
              stat={stat}
            />
          ))}
        </div>
      </section>

      <section
        className="doc-metric-stats"
        aria-label="Dashboard statistics"
      >
        {metricStats.map((stat) => (
          <MetricCard
            key={stat.label}
            stat={stat}
          />
        ))}
      </section>
    </>
  );
}

export default StatsCards;