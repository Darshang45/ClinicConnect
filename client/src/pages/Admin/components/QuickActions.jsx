import { useNavigate } from "react-router-dom";
import { quickActions } from "../data/dashboard";
import { Card } from "./common";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <h4 className="section-title">
        <span className="material-symbols-outlined">bolt</span>Quick Actions
      </h4>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button
            className="quick-action-card"
            key={action.id}
            type="button"
            onClick={() => action.to && navigate(action.to)}
          >
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
