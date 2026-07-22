import "../../../styles/patient_dashboard.css";

const summaryItems = [
  { label: "Blood Group", value: "O", unit: "+", accent: "primary" },
  { label: "Height", value: "178", unit: "cm", accent: "primary" },
  { label: "Weight", value: "72", unit: "kg", accent: "primary" },
  { label: "Last Checkup", value: "12", unit: "Aug", accent: "tertiary" },
  { label: "Health Score", value: "92", unit: "/100", accent: "primary" },
  { label: "Pending Reports", value: "1", unit: "new", accent: "tertiary" },
];

function HealthSummary() {
  return (
    <section className="pd-health-summary" aria-label="Health summary">
      {summaryItems.map((item) => (
        <article
          className={`pd-summary-card pd-summary-${item.accent}`}
          key={item.label}
        >
          <span>{item.label}</span>
          <strong>
            {item.value} <small>{item.unit}</small>
          </strong>
        </article>
      ))}
    </section>
  );
}

export default HealthSummary;
