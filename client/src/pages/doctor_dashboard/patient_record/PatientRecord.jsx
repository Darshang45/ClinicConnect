import Card from "../../../components/common/Card";
import "../../../styles/doctor_dashboard.css";

function PatientRecord({
  patient,
  appointments,
  prescriptions,
}) {
  
  return (
    <Card className="doc-workspace">

      <div className="doc-workspace-header">
        <div>
          <span />
          <h2>Patient Medical Record</h2>
        </div>
      </div>

      <div className="doc-workspace-content">

        <div className="doc-patient-record-header">

          <h2>{patient.fullName}</h2>

          <div className="doc-patient-record-grid">

  <div className="doc-patient-record-item">
    <label>Patient ID</label>
    <p>{patient.patientId || "-"}</p>
</div>

  <div className="doc-patient-record-item">
    <label>Phone</label>
    <p>{patient.phone || "-"}</p>
  </div>

  <div className="doc-patient-record-item">
    <label>Gender</label>
    <p>{patient.gender || "-"}</p>
  </div>

  <div className="doc-patient-record-item">
    <label>Blood Group</label>
    <p>{patient.bloodGroup || "-"}</p>
  </div>

  <div className="doc-patient-record-item">
    <label>Date of Birth</label>
    <p>
      {patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toLocaleDateString("en-IN")
        : "-"}
    </p>
  </div>

  <div className="doc-patient-record-item">
    <label>Address</label>
    <p>{patient.address || "-"}</p>
  </div>

</div>

        </div>

        <hr />

        <section className="doc-record-section">

  <h3>Medical Information</h3>

  <div className="doc-patient-record-grid">

    <div>
      <label>Allergies</label>
      <p>
        {patient.allergies?.length
          ? patient.allergies.join(", ")
          : "None"}
      </p>
    </div>

    <div>
      <label>Chronic Diseases</label>
      <p>
        {patient.chronicDiseases?.length
          ? patient.chronicDiseases.join(", ")
          : "None"}
      </p>
    </div>

    <div>
      <label>Emergency Contact</label>
      <p>
        {patient.emergencyContact?.name || "-"}
      </p>
    </div>

    <div>
      <label>Emergency Phone</label>
      <p>
        {patient.emergencyContact?.phone || "-"}
      </p>
    </div>

  </div>

</section>

        <section className="doc-record-section">

          <h3>Previous Appointments</h3>

          {appointments.length === 0 ? (

            <p>No appointments found.</p>

          ) : (

            <table className="doc-preview-table">

              <thead>

                <tr>

                  <th>Date</th>

                  <th>Doctor</th>

                  <th>Department</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {appointments.map((appointment) => (

                  <tr key={appointment._id}>

                    <td>
                      {new Date(
                        appointment.appointmentStart
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      Dr. {appointment.doctor?.user?.fullName}
                    </td>

                    <td>
                      {appointment.department?.name}
                    </td>

                    <td>
                      {appointment.status}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </section>

        <section className="doc-record-section">

  <h3>Prescription History</h3>

  {prescriptions.length === 0 ? (

    <p>No prescriptions found.</p>

  ) : (

    prescriptions.map((prescription) => (

      <Card
        key={prescription._id}
        className="doc-record-prescription"
      >

        <div className="doc-record-prescription-header">

          <div>

            <h4>
              {prescription.diagnosis || "No Diagnosis"}
            </h4>

            <small>
              {new Date(
                prescription.createdAt
              ).toLocaleDateString("en-IN")}
            </small>

          </div>

        </div>

        <div className="doc-record-prescription-body">

          <div className="doc-record-field">
    <strong>Notes</strong>
    <p>{prescription.notes || "-"}</p>
</div>

          <div className="doc-record-field" >

            <strong>Follow-up Date</strong>

            <p>
              {prescription.followUpDate
                ? new Date(
                    prescription.followUpDate
                  ).toLocaleDateString("en-IN")
                : "-"}
            </p>

          </div>

          <div className="doc-record-field">

            <strong>Medicines</strong>

            {prescription.medicines?.length ? (

              <div className="doc-medicine-list">

                {prescription.medicines.map((medicine, index) => (

                  <div
    key={index}
    className="doc-medicine-item"
>
    <div className="doc-medicine-details">

        <div className="doc-medicine-title">
  {medicine.medicine?.name ||
   medicine.medicine?.genericName ||
   medicine.medicineName ||
   "Unknown Medicine"}
</div>

        <div className="doc-medicine-meta">
            Dosage: {medicine.dosage} • Frequency: {medicine.frequency} • Duration: {medicine.duration} • Quantity: {medicine.quantity}
        </div>

    </div>
</div>

                ))}

              </div>

            ) : (

              <p>No medicines prescribed.</p>

            )}

          </div>

        </div>

      </Card>

    ))

  )}

</section>

      </div>

    </Card>
  );
}

export default PatientRecord;