import { useMemo, useState } from "react";
import { MdCancel, MdEdit, MdLogin } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import initialAppointments from "../data/appointments";

const filters = [
  { label: "All Appts", value: "all" },
  { label: "Waiting", value: "waiting" },
  { label: "Completed", value: "completed" },
];

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

function AppointmentQueue({ appointments = initialAppointments }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredAppointments = useMemo(
    () => activeFilter === "all"
      ? appointments
      : appointments.filter((appointment) => appointment.status.toLowerCase() === activeFilter),
    [activeFilter, appointments],
  );

  return (
    <section className="rc-queue-section" id="queue">
      <div className="rc-section-heading rc-queue-heading">
        <h2>Appointment Queue</h2>
        <div className="rc-filter-tabs" aria-label="Filter appointments">
          {filters.map((filter) => (
            <Button
              aria-pressed={activeFilter === filter.value}
              className={activeFilter === filter.value ? "is-selected" : ""}
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
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
              {filteredAppointments.length > 0
                ? filteredAppointments.map((appointment) => <AppointmentRow appointment={appointment} key={appointment.patientId} />)
                : <tr><td className="rc-empty-queue" colSpan="6">No {activeFilter} appointments.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="rc-table-footer">
          <p>Showing {filteredAppointments.length} of {appointments.length} appointments</p>
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
