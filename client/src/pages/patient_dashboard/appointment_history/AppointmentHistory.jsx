import { FiActivity, FiEye, FiFileText } from "react-icons/fi";
import Card from "../../../components/common/Card";
import { appointmentHistory } from "../data/appointments";
import "../../../styles/patient_dashboard.css";

const historyIcons = [FiActivity, FiFileText, FiEye];

function AppointmentHistory() {
  return <Card className="pd-appointment-history" id="appointment-history"><div className="pd-section-heading"><h2>Medical Overview &amp; Timeline</h2><div className="pd-history-tabs"><span className="is-active">History</span><span>Prescriptions</span></div></div><div className="pd-timeline">{appointmentHistory.map((item, index) => { const Icon = historyIcons[index]; return <article className={`pd-timeline-item ${item.featured ? "is-featured" : ""}`} key={item.id}><span className="pd-timeline-icon"><Icon /></span><div className="pd-timeline-content"><div><small>{item.type}</small><h3>{item.title}</h3><p>{item.description}</p></div><div className="pd-timeline-date"><strong>{item.date}</strong><small>{item.provider}</small></div></div></article>; })}</div></Card>;
}

export default AppointmentHistory;
