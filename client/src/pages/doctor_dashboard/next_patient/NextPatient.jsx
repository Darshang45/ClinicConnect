import Button from "../../../components/common/Button";
import "../../../styles/doctor_dashboard.css";

function NextPatient() {
  return (
    <div className="doc-next-patient">
      <Button className="doc-next-patient-button">
        Next Patient: Sarah Parker
        <span className="material-symbols-outlined">arrow_forward</span>
      </Button>
    </div>
  );
}

export default NextPatient;
