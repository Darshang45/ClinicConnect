import { MdAddTask, MdEventAvailable, MdPayments, MdPrint } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

const actions = [
  { label: "Add Walk-in", icon: MdAddTask },
  { label: "Check Avail", icon: MdEventAvailable },
  { label: "Collect Bill", icon: MdPayments },
  { label: "Print Label", icon: MdPrint },
];

export function ActionButton({ label, icon: Icon }) {
  return (
    <Button className="rc-quick-action">
      <Icon />
      <span>{label}</span>
    </Button>
  );
}

function QuickActions() {
  return (
    <section className="rc-quick-actions-section">
      <div className="rc-section-heading"><h2>Quick Actions</h2></div>
      <Card className="rc-quick-actions-card">
        {actions.map((action) => <ActionButton {...action} key={action.label} />)}
      </Card>
    </section>
  );
}

export default QuickActions;
