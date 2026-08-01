import { FiArrowRight, FiDownload, FiEye } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { reports } from "../data/reports";
import "../../../styles/patient_dashboard.css";

function LabReports() {
  return (
    <section className="pd-lab-reports" id="reports">
      <div className="pd-section-heading">
        <h2>Recent Lab Reports</h2>
        <a className="pd-repository-link" href="#medical-records">
          Browse Repository <FiArrowRight />
        </a>
      </div>
      <div className="pd-report-grid">
        {reports.map((report) => (
          <Card className="pd-report-card" key={report.id}>
            <span className="pd-report-icon">{report.type.slice(0, 2)}</span>
            <span className="pd-report-status">{report.status}</span>
            <h3>{report.title}</h3>
            <p>Date: {report.date}</p>
            <small>{report.doctor}</small>
            <div className="pd-report-footer">
              <span>
                {report.size} • {report.format}
              </span>
              <Button
                className="pd-report-action"
                aria-label={`${report.action} ${report.title}`}
              >
                {report.action === "visibility" ? <FiEye /> : <FiDownload />}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default LabReports;
