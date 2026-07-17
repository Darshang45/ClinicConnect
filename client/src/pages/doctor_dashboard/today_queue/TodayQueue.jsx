import Card from "../../../components/common/Card";
import { queuePatients } from "../data/queue";
import "../../../styles/doctor_dashboard.css";

function QueueCard({ patient }) {
  return (
    <Card className={`doc-queue-card ${patient.active ? "active" : ""}`}>
      <div className="doc-queue-card-top">
        <span className={`doc-queue-status ${patient.active ? "active" : ""}`}>{patient.status}</span>
        <time>{patient.time}</time>
      </div>
      <strong>{patient.name}</strong>
      <p>ID: #{patient.id} • {patient.visit}</p>
    </Card>
  );
}

function TodayQueue() {
  return (
    <section className="doc-queue-section">
      <div className="doc-section-heading">
        <h2>Today&apos;s Queue</h2>
        <span>{queuePatients.length} Patients Remaining</span>
      </div>
      <div className="doc-queue-list">
        {queuePatients.map((patient) => <QueueCard key={patient.id} patient={patient} />)}
      </div>
    </section>
  );
}

export default TodayQueue;
