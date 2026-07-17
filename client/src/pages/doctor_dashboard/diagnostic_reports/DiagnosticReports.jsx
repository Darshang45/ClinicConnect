import { diagnosticReports } from "../data/reports";
import "../../../styles/doctor_dashboard.css";

function DiagnosticReports() {
  return (
    <section className="doc-reports-section">
      <h3 className="doc-subsection-title">Diagnostic Reports</h3>
      <div className="doc-report-list">
        {diagnosticReports.map((report) => (
          <button className="doc-report-card" type="button" key={report.id}>
            <span className={`doc-report-icon ${report.type}`}>
              <span className="material-symbols-outlined">{report.icon}</span>
            </span>
            <span className="doc-report-info">
              <strong>{report.title}</strong>
              <small>{report.meta}</small>
            </span>
            <span className="material-symbols-outlined doc-report-open">open_in_new</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default DiagnosticReports;
