import useAuth from "../../../hooks/useAuth";
import "../../../styles/doctor_dashboard.css";

function PrescriptionPreview({
  appointment,
  prescription,
}) {
  const { user } = useAuth();

  if (!appointment || !prescription) {

   
    return (
      <section className="doc-prescription-preview-section">
          <div id="print-prescription">
        <h3 className="doc-subsection-title">
          Prescription Preview
        </h3>

        <div className="doc-prescription-preview">
          <p>No prescription available.</p>
        </div>
        </div>
      </section>
    );
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });


  return (
  <section className="doc-prescription-preview-section">

  
    <h3 className="doc-subsection-title">
      Prescription Preview
    </h3>

    {/* ================= PRINTABLE AREA ================= */}

    <div id="doc-print-area">

      <div className="doc-prescription-preview">

        {/* ================= HEADER ================= */}

        <div className="doc-preview-header">

          <div className="doc-clinic-info">

            <h2>ClinicConnect</h2>

            <p>
              Healthcare Management System
            </p>

            <small>
              Digital Healthcare Platform
            </small>

          </div>

          <div className="doc-doctor-info">

            <h3>
              Dr. {appointment.doctor.name}
            </h3>

            <p>
              {appointment.doctor.specialization}
            </p>

            <small>
              Department :{" "}
              {appointment.department?.name}
            </small>

          </div>

        </div>

        <hr className="doc-preview-divider" />

        {/* ================= PATIENT INFORMATION ================= */}

        {/* ================= PATIENT INFORMATION ================= */}

<div className="doc-preview-section">

  <h4>Patient Information</h4>

  <div className="doc-preview-grid">

    <div>
      <label>Patient Name</label>

      <p>
        {appointment.patient.fullName}
      </p>
    </div>

    <div>
      <label>Patient ID</label>

      <p>
        {appointment.patient.patientId}
      </p>
    </div>

    <div>
      <label>Age</label>

      <p>
        {appointment.patient.age} Years
      </p>
    </div>

    <div>
      <label>Gender</label>

      <p>
        {appointment.patient.gender}
      </p>
    </div>

    <div>
      <label>Blood Group</label>

      <p>
        {appointment.patient.bloodGroup}
      </p>
    </div>

    <div>
      <label>Phone</label>

      <p>
        {appointment.patient.phone}
      </p>
    </div>

    <div>
      <label>Allergies</label>

      <p>
        {appointment.patient.allergies?.length
          ? appointment.patient.allergies.join(", ")
          : "None"}
      </p>
    </div>

    <div>
      <label>Chronic Diseases</label>

      <p>
        {appointment.patient.chronicDiseases?.length
          ? appointment.patient.chronicDiseases.join(", ")
          : "None"}
      </p>
    </div>

  </div>

</div>

<hr className="doc-preview-divider" />

{/* ================= APPOINTMENT INFORMATION ================= */}

<div className="doc-preview-section">

  <h4>Appointment Information</h4>

  <div className="doc-preview-grid">

    <div>
      <label>Date</label>

      <p>
        {new Date(
          appointment.appointmentDate
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>

    <div>
      <label>Time</label>

      <p>
        {appointment.appointmentTime}
      </p>
    </div>

    <div>
      <label>Department</label>

      <p>
        {appointment.department?.name}
      </p>
    </div>

    <div>
      <label>Consultation</label>

      <p>
        {appointment.consultationType}
      </p>
    </div>

    <div>
      <label>Token Number</label>

      <p>
        {appointment.tokenNumber}
      </p>
    </div>

    <div>
      <label>Status</label>

      <span
        className={`doc-status-badge ${appointment.status
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        {appointment.status}
      </span>
    </div>

  </div>

</div>

<hr className="doc-preview-divider" />

{/* ================= REASON FOR VISIT ================= */}
{/* ================= REASON FOR VISIT ================= */}

<div className="doc-preview-section">

  <h4>Reason for Visit</h4>

  <div className="doc-notes-box">

    <p>
      {appointment.reason ||
        "No reason provided."}
    </p>

  </div>

</div>

{/* ================= PRESENTING SYMPTOMS ================= */}

<div className="doc-preview-section">

  <h4>Presenting Symptoms</h4>

  <div className="doc-diagnosis-box">

    {appointment.symptoms?.length > 0 ? (

      <ul className="doc-symptoms-list">

        {appointment.symptoms.map(
          (symptom, index) => (

            <li key={index}>
              {symptom}
            </li>

          )
        )}

      </ul>

    ) : (

      <p>
        No symptoms recorded.
      </p>

    )}

  </div>

</div>

{/* ================= DIAGNOSIS ================= */}

<div className="doc-preview-section">
  <h4>Diagnosis</h4>

  <div className="doc-diagnosis-box">
    <p>
      {prescription.diagnosis || "Diagnosis not available."}
    </p>
  </div>
</div>

<hr className="doc-preview-divider" />

{/* ================= PRESCRIPTION ================= */}

<div className="doc-preview-section">
  <h4>Medicines Prescribed</h4>

  {prescription.medicines?.length ? (

    <table className="doc-preview-table">

      <thead>
        <tr>
          <th>#</th>
          <th>Medicine</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
          <th>Quantity</th>
        </tr>
      </thead>

      <tbody>
  {prescription.medicines.map((item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>

      <td>
        <strong>
          {item.medicine?.name ||
            item.medicineName ||
            "Unknown Medicine"}
        </strong>

        <div className="doc-medicine-strength">
          {item.medicine?.genericName}
          {item.medicine?.strength
            ? ` • ${item.medicine.strength}`
            : ""}
        </div>

        {item.instructions && (
          <div className="doc-medicine-instruction">
            {item.instructions}
          </div>
        )}
      </td>

      <td>{item.dosage}</td>
      <td>{item.frequency}</td>
      <td>{item.duration}</td>
      <td>{item.quantity}</td>
    </tr>
  ))}
</tbody>

    </table>

  ) : (

    <div className="doc-empty-table">
      No medicines prescribed.
    </div>

  )}

</div>

<hr className="doc-preview-divider" />

{/* ================= CLINICAL NOTES ================= */}

<div className="doc-preview-section">

  <h4>Clinical Notes</h4>

  <div className="doc-notes-box">

    <p>
      {prescription.notes || "No clinical notes provided."}
    </p>

  </div>

</div>

<hr className="doc-preview-divider" />

{/* ================= FOLLOW-UP ================= */}

<div className="doc-preview-section">

  <h4>Follow-up</h4>

  <div className="doc-followup-card">

    {prescription.followUpDate ? (

      <>
        <strong>
          {new Date(
            prescription.followUpDate
          ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </strong>

        <p>Please revisit the doctor on the scheduled date.</p>
      </>

    ) : (

      <p>No follow-up appointment scheduled.</p>

    )}

  </div>

</div>

{/* ================= CONSULTATION TIMELINE ================= */}

<div className="doc-preview-section">

  <h4>Consultation Timeline</h4>

  <div className="doc-timeline">

    <div className="doc-timeline-card">

      <span className="material-symbols-outlined">
        login
      </span>

      <small>Check-In</small>

      <strong>

        {appointment.timeline?.checkInTime
          ? new Date(
              appointment.timeline.checkInTime
            ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--"}

      </strong>

    </div>

    <div className="doc-timeline-card">

      <span className="material-symbols-outlined">
        stethoscope
      </span>

      <small>Started</small>

      <strong>

        {appointment.timeline?.consultationStartTime
          ? new Date(
              appointment.timeline.consultationStartTime
            ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--"}

      </strong>

    </div>

    <div className="doc-timeline-card">

      <span className="material-symbols-outlined">
        task_alt
      </span>

      <small>Completed</small>

      <strong>

        {appointment.timeline?.consultationEndTime
          ? new Date(
              appointment.timeline.consultationEndTime
            ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--"}

      </strong>

    </div>

  </div>

</div>

<hr className="doc-preview-divider" />

{/* ================= DOCTOR SIGNATURE ================= */}

<div className="doc-preview-footer">

  <div className="doc-preview-signature">

    <div className="doc-sign-line"></div>

    <h4>
      Dr. {appointment.doctor.name}
    </h4>

    <p>
      {appointment.doctor.specialization}
    </p>

    <small>
      {appointment.department?.name}
    </small>

  </div>

  <div className="doc-preview-appointment">

    <div className="doc-preview-qr">

      <span className="material-symbols-outlined">
        qr_code_2
      </span>

    </div>

    <small>
      Appointment ID
    </small>

    <strong>
      {appointment.appointmentId}
    </strong>

    <small
      style={{
        marginTop: "10px",
        display: "block",
      }}
    >
      Status
    </small>

    <span
      className={`doc-status-badge ${appointment.status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {appointment.status}
    </span>

  </div>

</div>

{/* ================= FOOTER ================= */}

<div className="doc-preview-bottom">

  <p>
    This prescription has been electronically
    generated using the ClinicConnect Healthcare
    Management System.
  </p>

  <small>
    Generated on{" "}
    {new Date().toLocaleString("en-IN")}
  </small>

</div>

</div>

</div>

{/* ================= ACTION BUTTONS ================= */}

<div className="doc-preview-actions">

  <button
  type="button"
  className="doc-save-button"
  onClick={() => window.print()}
>
  <span className="material-symbols-outlined">
    print
  </span>
  Print Prescription
</button>

</div>


</section>
);
}

export default PrescriptionPreview;