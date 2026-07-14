import { currentPatient } from "../data/patients";
import "../../../styles/doctor_dashboard.css";

function Consultation() {
  return (
    <section className="doc-consultation-section">
      <h3 className="doc-subsection-title">Examination &amp; Vitals</h3>
      <div className="doc-vitals-grid">
        {currentPatient.vitals.map((vital) => (
          <label className="doc-vital-card" key={vital.label}>
            <span>{vital.label}</span>
            <div>
              <input defaultValue={vital.value} aria-label={vital.label} />
              <i className={`material-symbols-outlined ${vital.tone}`}>{vital.icon}</i>
            </div>
          </label>
        ))}
      </div>
      <label className="doc-consultation-field">
        <span>Presenting Symptoms</span>
        <textarea defaultValue={currentPatient.symptoms} aria-label="Presenting symptoms" />
      </label>
      <label className="doc-consultation-field">
        <span>Clinical Observation Notes</span>
        <textarea defaultValue={currentPatient.clinicalNotes} aria-label="Clinical observation notes" />
      </label>
    </section>
  );
}

export default Consultation;
