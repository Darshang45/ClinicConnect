import { FiCalendar, FiUpload, FiUserPlus, FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/common/Card";
import "../../../styles/patient_dashboard.css";

const quickActions = [
  { label: "Book Appointment", icon: FiCalendar, path: "/patient/book" },
  { label: "Find Doctor", icon: FiUserPlus, path: "/patient/doctors" },
  { label: "Video Consultation", icon: FiVideo },
  { label: "Upload Report", icon: FiUpload },
];

function QuickActions({ onUploadReport }) {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action.label === "Upload Report" && onUploadReport) {
      onUploadReport();
    } else if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <Card className="pd-quick-actions">
      <div className="pd-section-heading">
        <h2>Quick Actions</h2>
      </div>
      <div className="pd-quick-action-grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              className="pd-quick-action"
              type="button"
              key={action.label}
              onClick={() => handleAction(action)}
            >
              <Icon />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default QuickActions;
