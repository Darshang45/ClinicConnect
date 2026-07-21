import { FiCalendar, FiHeart, FiHelpCircle, FiUpload, FiUserPlus, FiVideo } from "react-icons/fi";
import Card from "../../../components/common/Card";
import "../../../styles/patient_dashboard.css";

const quickActions = [{ label: "Book Appointment", icon: FiCalendar }, { label: "Find Doctor", icon: FiUserPlus }, { label: "Video Consultation", icon: FiVideo }, { label: "Upload Report", icon: FiUpload }];

function QuickActions() { return <Card className="pd-quick-actions"><div className="pd-section-heading"><h2>Quick Actions</h2></div><div className="pd-quick-action-grid">{quickActions.map(({ label, icon: Icon }) => <button className="pd-quick-action" type="button" key={label}><Icon /><span>{label}</span></button>)}</div></Card>; }

export default QuickActions;
