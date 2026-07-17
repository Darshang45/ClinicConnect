import { MdEventAvailable, MdPrint } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

const actions = [
  { label: "Check Availability", icon: MdEventAvailable, key: "availability" },
  { label: "Print Prescription", icon: MdPrint, key: "print" },
];

export function ActionButton({ label, icon: Icon, onClick }) {
  return (
    <Button className="rc-quick-action" onClick={onClick}>
      <Icon />
      <span>{label}</span>
    </Button>
  );
}

function QuickActions({ onCheckAvailability }) {
  return (
    <section className="rc-quick-actions-section">
      <div className="rc-section-heading"><h2>Quick Actions</h2></div>
      <Card className="rc-quick-actions-card">
        {actions.map((action) => <ActionButton {...action} key={action.label} onClick={action.key === "availability" ? onCheckAvailability : undefined} />)}
      </Card>
    </section>
  );
}

export default QuickActions;
