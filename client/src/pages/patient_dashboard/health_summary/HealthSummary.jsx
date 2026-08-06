import "../../../styles/patient_dashboard.css";

const summaryItems = [
  { label: "Blood Group", value: "O", unit: "+", accent: "primary" },
  { label: "Height", value: "178", unit: "cm", accent: "primary" },
  { label: "Weight", value: "72", unit: "kg", accent: "primary" },
  { label: "Last Checkup", value: "12", unit: "Aug", accent: "tertiary" },
  { label: "Health Score", value: "92", unit: "/100", accent: "primary" },
  { label: "Pending Reports", value: "1", unit: "new", accent: "tertiary" },
];

function HealthSummary({ stats, bloodGroup }) {
  const summaryItems = stats
    ? [
        { label: "Upcoming Appointments", value: stats.upcomingAppointments ?? 0, unit: "active", accent: "primary" },
        { label: "Completed Appointments", value: stats.completedAppointments ?? 0, unit: "total", accent: "primary" },
        { label: "Cancelled Appointments", value: stats.cancelledAppointments ?? 0, unit: "total", accent: "tertiary" },
        { label: "Active Prescriptions", value: stats.activePrescriptions ?? 0, unit: "issued", accent: "primary" },
        { label: "Blood Group", value: bloodGroup || "N/A", unit: "", accent: "primary" },
      ]
    : [
        { label: "Blood Group", value: bloodGroup || "O+", unit: "", accent: "primary" },
        { label: "Height", value: "178", unit: "cm", accent: "primary" },
        { label: "Weight", value: "72", unit: "kg", accent: "primary" },
        { label: "Last Checkup", value: "12", unit: "Aug", accent: "tertiary" },
        { label: "Health Score", value: "92", unit: "/100", accent: "primary" },
        { label: "Pending Reports", value: "1", unit: "new", accent: "tertiary" },
      ];

  return (
    <section className="pd-health-summary" aria-label="Health summary">
      {summaryItems.map((item) => (
        <article
          className={`pd-summary-card pd-summary-${item.accent}`}
          key={item.label}
        >
          <span>{item.label}</span>
          <strong>
            {item.value} {item.unit && <small>{item.unit}</small>}
          </strong>
        </article>
      ))}
    </section>
  );
}

export default HealthSummary;
