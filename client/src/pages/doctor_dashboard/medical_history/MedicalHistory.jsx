import { currentPatient } from "../data/patients";
import "../../../styles/doctor_dashboard.css";

function MedicalHistory() {
  return (
    <section className="doc-history-section">
      <h3 className="doc-subsection-title">Medical History</h3>
      <div className="doc-history-timeline">
        {currentPatient.history.map((visit) => (
          <article className="doc-history-item" key={visit.date}>
            <span className={`doc-history-dot ${visit.active ? "active" : ""}`} />
            <time className={visit.active ? "active" : ""}>{visit.date}</time>
            <strong>{visit.title}</strong>
            <p>{visit.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MedicalHistory;
