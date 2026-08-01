import { FiActivity } from "react-icons/fi";
import Card from "../../../components/common/Card";
import { healthMetrics } from "../data/healthMetrics";
import "../../../styles/patient_dashboard.css";

function HealthMetrics() {
  return (
    <section className="pd-detail-section" id="health-metrics">
      <div className="pd-section-heading">
        <h2>Health Metrics</h2>
        <a href="#health-metrics">View trends</a>
      </div>
      <div className="pd-metric-grid">
        {healthMetrics.map((metric) => (
          <Card className="pd-metric-card" key={metric.id}>
            <span className="pd-metric-icon">
              <FiActivity />
            </span>
            <span>{metric.label}</span>
            <strong>
              {metric.value}
              <small>{metric.unit}</small>
            </strong>
            <em>{metric.state}</em>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default HealthMetrics;
