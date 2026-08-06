import "../../../styles/doctor_dashboard.css";

function NextPatient({
  appointments,
  currentAppointment,
  onSelectAppointment,
}) {

  const nextPatient = appointments.find((appointment) => {

    if (
      currentAppointment &&
      appointment.appointmentId ===
        currentAppointment.appointmentId
    ) {
      return false;
    }

    return [
      "Scheduled",
      "Checked-In",
    ].includes(appointment.status);

  });

  if (!nextPatient) {
    return (
      <section className="doc-next-patient">
        

        <div className="doc-next-empty">

  <span className="material-symbols-outlined">
    task_alt
  </span>

  <h3>Today's consultations are completed</h3>

  <p>No more patients are waiting in today's queue.</p>

</div>
      </section>
    );
  }

  return (
    <section className="doc-next-patient">

 

      <div className="doc-next-card">

  <div className="doc-next-details">

    <strong>{nextPatient.patientName}</strong>

    <div className="doc-next-meta">

      <span className="doc-next-chip">
        Token #{nextPatient.tokenNumber}
      </span>

      <span className="doc-next-chip">
        {nextPatient.appointmentTime}
      </span>

      <span className="doc-next-status">
        {nextPatient.status}
      </span>

    </div>

  </div>

  <button
    className="doc-complete-button doc-next-open"
    onClick={() => onSelectAppointment(nextPatient)}
  >
    Open Patient
  </button>

</div>

    </section>
  );
}

export default NextPatient;