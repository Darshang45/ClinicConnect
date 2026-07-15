import { MdCancel, MdEdit, MdLogin } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import appointments from "../data/appointments";

export function AppointmentRow({ appointment }) {
  return (
    <tr>
      <td>
        <strong>{appointment.time}</strong>
        {appointment.waitTime && <span className="rc-table-microcopy">{appointment.waitTime}</span>}
      </td>
      <td>
        <div className="rc-patient-cell">
          <span>{appointment.initials}</span>
          <div>
            <strong>{appointment.patient}</strong>
            <small>ID: {appointment.patientId}</small>
          </div>
        </div>
      </td>
      <td>{appointment.doctor}</td>
      <td><span className="rc-reason-badge">{appointment.reason}</span></td>
      <td>
        <span className={`rc-status rc-status-${appointment.statusTone}`}>
          <i />
          {appointment.status}
        </span>
      </td>
      <td>
        <div className="rc-table-actions">
          <Button aria-label={`Check in ${appointment.patient}`}><MdLogin /></Button>
          <Button aria-label={`Edit ${appointment.patient}`}><MdEdit /></Button>
          <Button aria-label={`Cancel ${appointment.patient}`}><MdCancel /></Button>
        </div>
      </td>
    </tr>
  );
}

function AppointmentQueue() {
  return (
    <section className="rc-queue-section" id="queue">
      <div className="rc-section-heading rc-queue-heading">
        <h2>Appointment Queue</h2>
        <div className="rc-filter-tabs">
          <Button className="is-selected">All Appts</Button>
          <Button>Waiting</Button>
          <Button>Completed</Button>
        </div>
      </div>
      <Card className="rc-queue-card">
        <div className="rc-table-wrap">
          <table className="rc-appointment-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Visit Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => <AppointmentRow appointment={appointment} key={appointment.patientId} />)}
            </tbody>
          </table>
        </div>
        <footer className="rc-table-footer">
          <p>Showing 10 of 42 appointments</p>
          <div>
            <Button>Previous</Button>
            <Button>Next</Button>
          </div>
        </footer>
      </Card>
    </section>
  );
}

export default AppointmentQueue;
