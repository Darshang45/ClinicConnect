import { useState } from "react";
import { FiEdit3, FiX } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import patientPhoto from "../../../assets/images/hero/patient1.jpg";
import "../../../styles/patient_dashboard.css";

const defaultProfileDetails = [
  { label: "Age", value: "28 years" },
  { label: "Gender", value: "Male" },
  { label: "Blood group", value: "O+" },
  { label: "Height", value: "178 cm" },
  { label: "Weight", value: "72 kg" },
  { label: "Allergies", value: "No known allergies" },
  { label: "Chronic diseases", value: "Hypertension" },
  { label: "Emergency contact", value: "Ananya Srivastava" },
  { label: "Insurance", value: "CareSecure Health" },
];

const getSummaryProfileDetails = (patient) => [
  { label: "Age", value: patient?.age || "28 years" },
  { label: "Gender", value: patient?.gender || "Male" },
  { label: "Blood group", value: patient?.bloodGroup || "O+" },
  { label: "Height", value: patient?.height || "178 cm" },
  { label: "Weight", value: patient?.weight || "72 kg" },
  { label: "Allergies", value: patient?.allergies || "No known allergies" },
  { label: "Chronic diseases", value: patient?.chronicDiseases || "Hypertension" },
  { label: "Emergency contact", value: patient?.emergencyContact || "Ananya Srivastava" },
  { label: "Insurance", value: patient?.insurance || "CareSecure Health" },
];

const editableFields = [
  { label: "First name", key: "firstName" },
  { label: "Last name", key: "lastName" },
  { label: "Gender", key: "gender" },
  { label: "Blood group", key: "bloodGroup" },
  { label: "Height", key: "height" },
  { label: "Weight", key: "weight" },
  { label: "Phone", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Address", key: "address" },
  { label: "Doctor", key: "doctor" },
  { label: "Symptoms", key: "symptoms" },
];

const getNameParts = (name = "") => {
  const [firstName = "", ...lastName] = name.split(" ");
  return { firstName, lastName: lastName.join(" ") };
};

const normalisePatient = (patient) => ({
  ...getNameParts(patient?.name),
  ...patient,
  firstName: patient?.firstName || getNameParts(patient?.name).firstName,
  lastName: patient?.lastName || getNameParts(patient?.name).lastName,
  gender: patient?.gender || "",
  bloodGroup: patient?.bloodGroup || "",
  height: patient?.height || "",
  weight: patient?.weight || "",
  phone: patient?.phone || "",
  email: patient?.email || "",
  address: patient?.address || "",
  doctor: patient?.doctor || patient?.primaryDoctor || "",
  symptoms: patient?.symptoms || "",
});

const profileTokens = {
  "--pd-primary": "#006b2c",
  "--pd-low": "#f2f4f3",
  "--pd-muted": "#536052",
  "--pd-text": "#191c1c",
};

function PatientProfile({ isEditing: isEditingProp, onClose, isReceptionPanel = Boolean(onClose), onToggleEdit, onUpdate, patient }) {
  const isEditable = Boolean(patient && onUpdate);
  const isControlled = typeof isEditingProp === "boolean";
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const isEditing = isControlled ? isEditingProp : localIsEditing;
  const [draft, setDraft] = useState(() => normalisePatient(patient));

  const saveChanges = () => {
    if (!isEditable) return;

    onUpdate({
      ...patient,
      ...draft,
      name: `${draft.firstName} ${draft.lastName}`.trim(),
    });
    if (!isControlled) setLocalIsEditing(false);
  };

  const handleEdit = () => {
    if (!isEditable) return;

    if (isControlled) {
      onToggleEdit?.();
      return;
    }

    if (isEditing) {
      saveChanges();
      return;
    }

    setLocalIsEditing(true);
  };

  const displayedDetails = isControlled && !isEditing
    ? getSummaryProfileDetails(patient)
    : isEditable
    ? editableFields.map((field) => ({ ...field, value: draft[field.key] || "Not provided" }))
    : defaultProfileDetails;
  const displayName = isEditable ? `${draft.firstName} ${draft.lastName}`.trim() : "Atharva Srivastava";
  const profileClassName = isReceptionPanel ? "rc-patient-profile" : "";
  const headerClassName = isReceptionPanel ? "rc-patient-profile-header" : "";
  const actionsClassName = isReceptionPanel ? "rc-patient-profile-actions" : "pd-profile-actions";
  const closeClassName = isReceptionPanel ? "rc-profile-close" : "pd-profile-close";

  return (
    <Card className={`pd-profile-card ${profileClassName}`.trim()} id="patient-profile" style={isEditable ? profileTokens : undefined}>
      <div className={`pd-section-heading ${headerClassName}`.trim()}>
        <h2>Patient Profile</h2>
        {onClose ? (
          <div className={actionsClassName}>
            {isControlled ? <>
              <Button className="pd-profile-edit" onClick={handleEdit}><FiEdit3 />Edit Profile</Button>
              <Button className="pd-profile-save" onClick={saveChanges}>Save Changes</Button>
            </> : <Button className="pd-profile-edit" onClick={handleEdit}><FiEdit3 />{isEditing ? "Save Changes" : "Edit Profile"}</Button>}
            <Button aria-label="Close patient profile" className={closeClassName} onClick={onClose}>
              <FiX />
            </Button>
          </div>
        ) : (
          <Button className="pd-profile-edit" onClick={handleEdit}>
            <FiEdit3 />
            {isEditing ? "Save profile" : "Edit profile"}
          </Button>
        )}
      </div>
      <div className="pd-profile-content">
        <div className="pd-profile-intro">
          <img src={patient?.image || patientPhoto} alt={displayName} />
          <h3>{displayName}</h3>
          <p>{isEditable ? `Patient ID: #${patient.id}` : "Platinum member"}</p>
        </div>
        <dl className="pd-profile-details">
          {displayedDetails.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{isEditing ? <Input aria-label={detail.label} className="pd-profile-field" name={detail.key} value={draft[detail.key]} onChange={(event) => setDraft((current) => ({ ...current, [event.target.name]: event.target.value }))} /> : detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}

export default PatientProfile;
