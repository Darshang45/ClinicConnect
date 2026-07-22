import { FiDownload, FiFileText } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { medicalRecords } from "../data/appointments";
import "../../../styles/patient_dashboard.css";

function MedicalRecords() {
  return (
    <section className="pd-detail-section" id="medical-records">
      <div className="pd-section-heading">
        <h2>Medical Records</h2>
        <a href="#reports">View repository</a>
      </div>
      <div className="pd-detail-grid">
        {medicalRecords.map((record) => (
          <Card className="pd-record-card" key={record.id}>
            <span className="pd-detail-icon">
              <FiFileText />
            </span>
            <small>Medical record</small>
            <h3>{record.diagnosis}</h3>
            <dl>
              <div>
                <dt>Visit date</dt>
                <dd>{record.visitDate}</dd>
              </div>
              <div>
                <dt>Doctor</dt>
                <dd>{record.doctor}</dd>
              </div>
              <div>
                <dt>Hospital</dt>
                <dd>{record.hospital}</dd>
              </div>
            </dl>
            <Button className="pd-compact-button">
              <FiDownload />
              Download
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default MedicalRecords;
