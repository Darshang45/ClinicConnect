import { MdDescription } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import patient from "../data/patient";

function PatientDetails() {
  return (
    
    <section className="rc-patient-details-section">
      <div className="rc-section-heading"><h2>Selected Patient Details</h2></div>
      <Card className="rc-patient-card">
        <header className="rc-patient-card-header">
          <img src={patient.image} alt={patient.name} />
          <div>
            <h3>{patient.name}</h3>
            <p>{patient.details}</p>
            <div className="rc-medical-alerts">
              {patient.alerts.map((alert, index) => <span className={index === 0 ? "danger" : "safe"} key={alert}>{alert}</span>)}
            </div>
          </div>
        </header>
        <div className="rc-patient-card-content">
          <div className="rc-patient-facts">
            <div><span>Last Visit</span><strong>{patient.lastVisit}</strong></div>
            <div><span>Primary Doctor</span><strong>{patient.primaryDoctor}</strong></div>
          </div>
          <div className="rc-history">
            <span>Recent History</span>
            <div className="rc-report-item">
              <MdDescription />
              <div><strong>{patient.report}</strong><small>{patient.reportDate}</small></div>
              <Button>View</Button>
            </div>
          </div>
          <div className="rc-patient-buttons">
            <Button>Edit Profile</Button>
            <Button>Schedule Visit</Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default PatientDetails;
