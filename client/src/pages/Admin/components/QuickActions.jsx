import { quickActions } from "../data/dashboard";
import { Card } from "./common";

function QuickActions() {
  return (
    <Card>
      <h4 className="section-title">
        <span className="material-symbols-outlined">bolt</span>Quick Actions
      </h4>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button className="quick-action-card" key={action.id} type="button">
            <span className="material-symbols-outlined" aria-hidden="true">
              {action.icon}
            </span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

export default QuickActions;
