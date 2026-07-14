import { currentPatient } from "../data/patients";
import "../../../styles/doctor_dashboard.css";

function PatientProfile() {
  const profileDetails = [
    { label: "Full Name", value: currentPatient.fullName, featured: true },
    { label: "ID / Age / Gender", value: `#${currentPatient.id} • ${currentPatient.age} • ${currentPatient.gender}` },
    { label: "Blood Group", value: currentPatient.bloodGroup, icon: "water_drop" },
    { label: "Known Allergies", value: currentPatient.allergies.join(", "), allergy: true },
  ];

  return (
    <div className="doc-patient-profile">
      <img className="doc-patient-photo" src={currentPatient.image} alt={currentPatient.fullName} />
      <div className="doc-patient-details">
        {profileDetails.map((detail) => (
          <div className="doc-profile-detail" key={detail.label}>
            <p>{detail.label}</p>
            <div className={detail.featured ? "doc-profile-featured" : "doc-profile-value"}>
              {detail.icon && <span className="material-symbols-outlined">{detail.icon}</span>}
              {detail.allergy ? <span className="doc-allergy-badge">{detail.value}</span> : <strong>{detail.value}</strong>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientProfile;
