import Button from "../../../components/common/Button";
import "../../../styles/doctor_dashboard.css";

const utilityActions = [
  { label: "Update Reception", icon: "edit_notifications" },
  { label: "Print Copy", icon: "print" },
];

function ActionFooter() {
  return (
    <section className="doc-action-footer">
      <div className="doc-utility-actions">
        {utilityActions.map((action) => (
          <Button className="doc-utility-button" key={action.label}>
            <span className="material-symbols-outlined">{action.icon}</span>{action.label}
          </Button>
        ))}
      </div>
      <div className="doc-primary-actions">
        <Button className="doc-save-button">Save Draft</Button>
        <Button className="doc-complete-button">
          <span className="material-symbols-outlined">send</span>
          Complete &amp; Send to Pharmacy
        </Button>
      </div>
    </section>
  );
}

export default ActionFooter;
