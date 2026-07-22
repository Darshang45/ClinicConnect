import { FiCalendar, FiUpload, FiUserPlus, FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/common/Card";
import "../../../styles/patient_dashboard.css";

const quickActions = [{ label: "Book Appointment", icon: FiCalendar, path: "/patient/book" }, { label: "Find Doctor", icon: FiUserPlus }, { label: "Video Consultation", icon: FiVideo }, { label: "Upload Report", icon: FiUpload }];

function QuickActions() { const navigate = useNavigate(); return <Card className="pd-quick-actions"><div className="pd-section-heading"><h2>Quick Actions</h2></div><div className="pd-quick-action-grid">{quickActions.map(({ label, icon: Icon, path }) => <button className="pd-quick-action" type="button" key={label} onClick={path ? () => navigate(path) : undefined}><Icon /><span>{label}</span></button>)}</div></Card>; }

export default QuickActions;
