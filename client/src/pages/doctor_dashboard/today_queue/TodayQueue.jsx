import Card from "../../../components/common/Card";
import "../../../styles/doctor_dashboard.css";

function QueueCard({
  appointment,
  selectedAppointment,
  onSelectAppointment,
}) {
  const isActive =
    appointment.status === "In Consultation";

  const isSelected =
    selectedAppointment?.appointmentId ===
    appointment.appointmentId;

  return (
    <Card
      className={`doc-queue-card ${
        isActive ? "active" : ""
      } ${isSelected ? "selected" : ""}`}
      onClick={() => onSelectAppointment(appointment)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          onSelectAppointment(appointment);
        }
      }}
    >
      <div className="doc-queue-card-top">
        <span
          className={`doc-queue-status ${
            isActive ? "active" : ""
          }`}
        >
          {appointment.status}
        </span>

        <time>
          {new Date(
            appointment.appointmentTime
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      <strong>{appointment.patientName}</strong>

      <p>
        ID: #{appointment.patientId} •{" "}
        {appointment.consultationType}
      </p>

      {appointment.reason && (
        <small className="doc-queue-reason">
          {appointment.reason}
        </small>
      )}
    </Card>
  );
}

function TodayQueue({
  appointments = [],
  selectedAppointment,
  onSelectAppointment,
}) {
  return (
    <section className="doc-queue-section">
      <div className="doc-section-heading">
        <h2>Today's Queue</h2>

        <span>
          {appointments.length} Appointments today
        </span>
      </div>

      <div className="doc-queue-list">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <QueueCard
              key={appointment.appointmentId}
              appointment={appointment}
              selectedAppointment={selectedAppointment}
              onSelectAppointment={onSelectAppointment}
            />
          ))
        ) : (
          <Card className="doc-queue-card">
            <strong>No Appointments Today</strong>

            <p>
              You have no scheduled consultations
              for today.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}

export default TodayQueue;