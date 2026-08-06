import "../../../styles/doctor_dashboard.css";

function Consultation({
  appointment,
  consultation,
  onConsultationChange,
  onStartConsultation,
  onCompleteConsultation,
  loading,
}) {
  if (!appointment) {
    return null;
  }

  const isScheduled =
    appointment.status === "Scheduled" ||
    appointment.status === "Checked-In";

  const isInConsultation =
    appointment.status === "In Consultation";

  const isCompleted =
    appointment.status === "Completed";

  return (
    <section className="doc-consultation-section">
      <h3 className="doc-subsection-title">
        Examination &amp; Consultation
      </h3>

      <div className="doc-consultation-actions">
  {!isCompleted && (
    <button
      type="button"
      className="doc-complete-button"
      onClick={onStartConsultation}
      disabled={
        loading ||
        !isScheduled ||
        isInConsultation
      }
    >
      <span className="material-symbols-outlined">
        play_circle
      </span>

      {loading
        ? "Starting..."
        : isInConsultation
        ? "Consultation In Progress"
        : "Start Consultation"}
    </button>
  )}

  {!isCompleted && (
    <button
      type="button"
      className="doc-save-button"
      onClick={onCompleteConsultation}
      disabled={
        loading ||
        !isInConsultation
      }
    >
      <span className="material-symbols-outlined">
        task_alt
      </span>

      {loading
        ? "Completing..."
        : "Complete Consultation"}
    </button>
  )}

  {isCompleted && (
    <div className="doc-consultation-completed">
      <span className="material-symbols-outlined">
        check_circle
      </span>

      <span>Consultation Completed</span>
    </div>
  )}
</div>

      <label className="doc-consultation-field">
        <span>Presenting Symptoms</span>

        <textarea
          value={consultation.symptoms}
          onChange={(e) =>
            onConsultationChange({
              ...consultation,
              symptoms: e.target.value,
            })
          }
          placeholder="Enter symptoms separated by commas"
          disabled={isCompleted}
        />
      </label>

      <label className="doc-consultation-field">
        <span>Clinical Observation Notes</span>

        <textarea
          value={consultation.notes}
          onChange={(e) =>
            onConsultationChange({
              ...consultation,
              notes: e.target.value,
            })
          }
          placeholder="Enter clinical observations..."
          disabled={isCompleted}
        />
      </label>
    </section>
  );
}

export default Consultation;