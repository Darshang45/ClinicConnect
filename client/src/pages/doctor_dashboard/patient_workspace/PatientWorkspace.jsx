import Card from "../../../components/common/Card";
import PatientProfile from "../patient_profile/PatientProfile";
import MedicalHistory from "../medical_history/MedicalHistory";
import DiagnosticReports from "../diagnostic_reports/DiagnosticReports";
import Consultation from "../consultation/Consultation";
import PrescriptionSection from "../prescription/PrescriptionSection";
import PrescriptionPreview from "../prescription_preview/PrescriptionPreview";
import "../../../styles/doctor_dashboard.css";

function PatientWorkspace() {
  return (
    <Card className="doc-workspace">
      <div className="doc-workspace-header">
        <div><span /><h2>Current Patient Workspace</h2></div>
      </div>
      <div className="doc-workspace-content">
        <PatientProfile />
        <div className="doc-workspace-body">
          <aside className="doc-workspace-sidebar">
            <MedicalHistory />
            <DiagnosticReports />
          </aside>
          <div className="doc-workspace-main">
            <Consultation />
            <PrescriptionSection />
            <PrescriptionPreview />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PatientWorkspace;
