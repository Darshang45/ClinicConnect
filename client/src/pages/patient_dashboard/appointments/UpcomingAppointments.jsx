import { FiCalendar, FiClock, FiVideo } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { upcomingAppointments } from "../data/appointments";
import "../../../styles/patient_dashboard.css";

function UpcomingAppointments() {
  return <Card className="pd-upcoming" id="appointments"><div className="pd-section-heading"><h2>Upcoming Appointment</h2><a href="#appointment-history">See all</a></div><div className="pd-appointment-table-wrap"><table className="pd-appointment-table"><thead><tr><th>Doctor</th><th>Department</th><th>Date &amp; Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>{upcomingAppointments.map((appointment) => <tr key={appointment.id}><td><div className="pd-doctor-cell"><img src={appointment.image} alt={appointment.doctor} /><span><strong>{appointment.doctor}</strong><small>{appointment.title}</small></span></div></td><td>{appointment.department}</td><td><strong>{appointment.date}</strong><small><FiClock />{appointment.time}</small></td><td><span className="pd-status">{appointment.status}</span></td><td><div className="pd-table-actions"><Button className="pd-table-button"><FiVideo />Join</Button><Button className="pd-table-button">Reschedule</Button><Button className="pd-table-link">Cancel</Button></div></td></tr>)}</tbody></table></div><div className="pd-appointment-mobile-note"><FiCalendar /> Appointment reminders are enabled.</div></Card>;
}

export default UpcomingAppointments;
