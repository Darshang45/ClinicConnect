import "../../../styles/doctor_dashboard.css";

function PatientProfile({ patient }) {
  if (!patient) {
    return null;
  }

  const profileDetails = [
    {
      label: "Full Name",
      value: patient.fullName,
      featured: true,
    },
    {
      label: "ID / Age / Gender",
      value: `#${patient.patientId} • ${patient.age} • ${patient.gender}`,
    },
    {
      label: "Blood Group",
      value: patient.bloodGroup || "N/A",
      icon: "water_drop",
    },
    {
      label: "Known Allergies",
      value:
        patient.allergies?.length > 0
          ? patient.allergies.join(", ")
          : "None",
      allergy: true,
    },
  ];

  return (
    <div className="doc-patient-profile">
      <div className="doc-patient-photo">
        <span className="material-symbols-outlined">
          person
        </span>
      </div>

      <div className="doc-patient-details">
        {profileDetails.map((detail) => (
          <div
            className="doc-profile-detail"
            key={detail.label}
          >
            <p>{detail.label}</p>

            <div
              className={
                detail.featured
                  ? "doc-profile-featured"
                  : "doc-profile-value"
              }
            >
              {detail.icon && (
                <span className="material-symbols-outlined">
                  {detail.icon}
                </span>
              )}

              {detail.allergy ? (
                <span className="doc-allergy-badge">
                  {detail.value}
                </span>
              ) : (
                <strong>{detail.value}</strong>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientProfile;