import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

export function WalkInCard({ walkIn }) {
  // Backend-safe values
  const patient = walkIn.patient || {};
  const doctor = walkIn.doctor || {};

  const patientName =
    patient.fullName ||
    walkIn.fullName ||
    walkIn.patientName ||
    "Unknown Patient";

  const reason =
    walkIn.reason ||
    "General Consultation";

  const appointmentStart = walkIn.appointmentStart
    ? new Date(walkIn.appointmentStart)
    : null;

  const appointmentEnd = walkIn.appointmentEnd
    ? new Date(walkIn.appointmentEnd)
    : null;

  const formatTime = (date) => {
    if (!date || Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const time =
    appointmentStart && appointmentEnd
      ? `${formatTime(appointmentStart)} - ${formatTime(appointmentEnd)}`
      : "Time not available";

  /*
   * Backend doesn't currently have a priority field.
   * Keep a safe default so the UI doesn't crash.
   */
  const priority = walkIn.priority || "Low";

  return (
    <article className="rc-walkin-card">
      <div className="rc-walkin-person">
        <div className="rc-priority-badge">
          <span>Priority</span>
          <strong className={priority.toLowerCase()}>
            {priority}
          </strong>
        </div>

        <div>
          <h3>{patientName}</h3>

          <p>
            {reason}
            {time && ` • ${time}`}
          </p>
        </div>
      </div>

      <div className="rc-walkin-action">
        <span>
          {doctor.specialization ||
            doctor.name ||
            "Doctor not assigned"}
        </span>

        <Button className="rc-small-action outline">
          Quick Intake
        </Button>
      </div>
    </article>
  );
}

function WalkInList({ walkIns = [] }) {
  return (
    <section className="rc-walkin-section">
      <div className="rc-section-heading">
        <h2>Live Walk-in List</h2>

        <span className="rc-count-badge">
          {walkIns.length} Current Walk-ins
        </span>
      </div>

      <Card className="rc-walkin-list">
        {walkIns.length > 0 ? (
          walkIns.map((walkIn, index) => {
            const key =
              walkIn.appointmentId ||
              walkIn._id ||
              walkIn.id ||
              walkIn.patient?._id ||
              walkIn.patient?.patientId ||
              `walkin-${index}`;

            return (
              <WalkInCard
                key={key}
                walkIn={walkIn}
              />
            );
          })
        ) : (
          <div className="rc-empty-queue">
            No walk-in patients today.
          </div>
        )}
      </Card>
    </section>
  );
}

export default WalkInList;