import { useMemo, useState } from "react";
import { MdCancel, MdLogin } from "react-icons/md";

import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

const filters = [
  { label: "All Appts", value: "all" },
  { label: "Waiting", value: "waiting" },
  { label: "Completed", value: "completed" },
];

export function AppointmentRow({ appointment, onCheckIn, onCancel }) {
  return (
    <tr>
      <td>
        <strong>{appointment.time}</strong>

        {appointment.waitTime && (
          <span className="rc-table-microcopy">{appointment.waitTime}</span>
        )}
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

      <td>
        <span className="rc-reason-badge">{appointment.reason}</span>
      </td>

      <td>
        <span className={`rc-status rc-status-${appointment.statusTone}`}>
          <i />
          {appointment.status}
        </span>
      </td>

      <td>
        <div className="rc-table-actions">
          <Button
            aria-label={`Check in ${appointment.patient}`}
            onClick={() => onCheckIn?.(appointment)}
            disabled={appointment.status !== "Scheduled"}
          >
            <MdLogin />In
          </Button>

          <Button
            aria-label={`Cancel ${appointment.patient}`}
            onClick={() => onCancel?.(appointment)}
            disabled={
              appointment.status === "Completed" ||
              appointment.status === "Cancelled" ||
              appointment.status === "In Consultation"
            }
          >
            <MdCancel />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function AppointmentQueue({ appointments = [], onCheckIn, onCancel }) {
  const [activeFilter, setActiveFilter] = useState("all");

  // IMPORTANT:
  // This must be INSIDE AppointmentQueue because
  // activeFilter and appointments are available here.
  const filteredAppointments = useMemo(() => {
    if (activeFilter === "all") {
      return appointments;
    }

    if (activeFilter === "waiting") {
      return appointments.filter((appointment) =>
        ["Scheduled", "Checked-In", "In Consultation"].includes(
          appointment.status,
        ),
      );
    }

    if (activeFilter === "completed") {
      return appointments.filter(
        (appointment) => appointment.status === "Completed",
      );
    }

    return appointments;
  }, [activeFilter, appointments]);

  return (
    <section className="rc-queue-section" id="queue">
      <div className="rc-section-heading rc-queue-heading">
        <h2>Appointment Queue</h2>

        <div className="rc-filter-tabs" aria-label="Filter appointments">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              aria-pressed={activeFilter === filter.value}
              className={activeFilter === filter.value ? "is-selected" : ""}
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
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <AppointmentRow
                    appointment={appointment}
                    onCheckIn={onCheckIn}
                    onCancel={onCancel}
                    key={appointment.appointmentId || appointment._id}
                  />
                ))
              ) : (
                <tr>
                  <td className="rc-empty-queue" colSpan="6">
                    No {activeFilter} appointments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="rc-table-footer">
          <p>
            Showing {filteredAppointments.length} of {appointments.length}{" "}
            appointments
          </p>

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
