import { useState } from "react";
import { FiEdit3, FiX } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import patientPhoto from "../../../assets/images/hero/patient1.jpg";
import "../../../styles/patient_dashboard.css";

const defaultProfileDetails = [
  
  // { label: "Gender", value: "Male" },
  // { label: "Blood group", value: "O+" },
  // { label: "Height", value: "178 cm" },
  // { label: "Weight", value: "72 kg" },
  // { label: "Allergies", value: "No known allergies" },
  // { label: "Chronic diseases", value: "Hypertension" },
  // { label: "Emergency contact", value: "Ananya Srivastava" },
  // { label: "Insurance", value: "CareSecure Health" },
  
  { label: "First name", value: "firstName" },
  { label: "Last name", value: "lastName" },
  { label: "Gender", value: "gender" },
  { label: "Blood group", value: "bloodGroup" },
  { label: "Height", value: "height" },
  { label: "Weight", value: "weight" },
  { label: "Age", value: "28 years" },
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "Address", value: "address" },
  { label: "Doctor",  value: "doctor" },
  { label: "Symptoms", value: "symptoms" },

  { label: "Allergies", value: "No known allergies" },
  { label: "Chronic diseases", value: "Hypertension" },
  { label: "Emergency contact", value: "Ananya Srivastava" },
  { label: "Insurance", value: "CareSecure Health" },
];

const getSummaryProfileDetails = (patient) => [
  { label: "FirstName", value: patient?.firstName || "John" },
  { label: "LastName", value: patient?.lastName || "Doe" },
  { label: "Gender", value: patient?.gender || "Male" },
  { label: "Blood group", value: patient?.bloodGroup || "O+" },
  { label: "Height", value: patient?.height || "178 cm" },
  { label: "Weight", value: patient?.weight || "72 kg" },
  { label: "Age", value: patient?.age || "28 years" },
   { label: "Phone", value: patient?.phone || "9157821134" },
  { label: "Email", value: patient?.email || "john.doe@example.com" },
  { label: "Address", value: patient?.address || "123 Main Street" },
  { label: "Doctor",  value: patient?.doctor || patient?.primaryDoctor || "Dr. Jane Smith" },
  { label: "Symptoms", value: patient?.symptoms || "Headache, Fever" },

  { label: "Allergies", value: patient?.allergies || "No known allergies" },
  { label: "Chronic diseases", value: patient?.chronicDiseases || "Hypertension" },

  {
    label: "Emergency contact",
    value: patient?.emergencyContact || "Ananya Srivastava",
  },
  { label: "Insurance", value: patient?.insurance || "CareSecure Health" },
];

const editableFields = [
  { label: "First name", key: "firstName" },
  { label: "Last name", key: "lastName" },
  { label: "Gender", key: "gender" },
  { label: "Blood group", key: "bloodGroup" },
  { label: "Height", key: "height" },
  { label: "Weight", key: "weight" },
  { label: "Age", key: "age" },
  { label: "Phone", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Address", key: "address" },
  { label: "Doctor", key: "doctor" },
  { label: "Symptoms", key: "symptoms" },
   { label: "Allergies", key: "allergies" },
  { label: "Chronic diseases", key: "chronicDiseases" },
  { label: "Emergency contact", key: "emergencyContact" },
  { label: "Insurance", key: "insurance" },
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
  "--pd-primary": "var(--primary)",
  "--pd-low": "var(--surface-container-low)",
  "--pd-muted": "var(--on-surface-variant)",
  "--pd-text": "var(--on-surface)",
};

const normaliseCustomProfile = (profile, fields) =>
  fields.reduce(
    (draft, field) => ({
      ...draft,
      [field.key]: profile?.[field.key] || "",
    }),
    { ...profile },
  );

function PatientProfile({
  className = "",
  editLabel = "Edit profile",
  fields,
  isEditing: isEditingProp,
  onClose,
  isReceptionPanel = Boolean(onClose),
  onToggleEdit,
  onUpdate,
  patient,
  profileDescription,
  saveLabel = "Save profile",
  title = "Patient Profile",
}) {
  const isEditable = Boolean(patient && onUpdate);
  const isControlled = typeof isEditingProp === "boolean";
  const isCustomProfile = Array.isArray(fields);
  const formFields = fields || editableFields;
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const isEditing = isControlled ? isEditingProp : localIsEditing;
  const [draft, setDraft] = useState(() =>
    isCustomProfile
      ? normaliseCustomProfile(patient, formFields)
      : normalisePatient(patient),
  );

  const saveChanges = () => {
    if (!isEditable) return;

    onUpdate(
      isCustomProfile
        ? { ...patient, ...draft }
        : {
            ...patient,
            ...draft,
            name: `${draft.firstName} ${draft.lastName}`.trim(),
          },
    );
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

  const displayedDetails =
    isControlled && !isEditing && !isCustomProfile
      ? getSummaryProfileDetails(patient)
      : isEditable
        ? formFields.map((field) => ({
            ...field,
            value: draft[field.key] || "Not provided",
          }))
        : defaultProfileDetails;
  const displayName = isCustomProfile
    ? draft.name || patient?.name || "Administrator"
    : isEditable
      ? `${draft.firstName} ${draft.lastName}`.trim()
      : "Atharva Srivastava";
  const profileClassName = isReceptionPanel ? "rc-patient-profile" : "";
  const headerClassName = isReceptionPanel ? "rc-patient-profile-header" : "";
  const actionsClassName = isReceptionPanel
    ? "rc-patient-profile-actions"
    : "pd-profile-actions";
  const closeClassName = isReceptionPanel
    ? "rc-profile-close"
    : "pd-profile-close";

  return (
    <Card
      className={`pd-profile-card ${profileClassName} ${className}`.trim()}
      id="patient-profile"
      style={isEditable ? profileTokens : undefined}
      
    >
      <div className={`pd-section-heading ${headerClassName}`.trim()}>
        <h2>{title}</h2>
        {onClose ? (
          <div className={actionsClassName}>
            {isControlled ? (
              <>
                <Button className="pd-profile-edit" onClick={handleEdit}>
                  <FiEdit3 />
                  Edit Profile
                </Button>
                <Button className="pd-profile-save" onClick={saveChanges}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button className="pd-profile-edit" onClick={handleEdit}>
                <FiEdit3 />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            )}
            <Button
              aria-label="Close patient profile"
              className={closeClassName}
              onClick={onClose}
            >
              <FiX />
            </Button>
          </div>
        ) : (
          <Button className="pd-profile-edit" onClick={handleEdit}>
            <FiEdit3 />
            {isEditing ? saveLabel : editLabel}
          </Button>
        )}
      </div>
      <div className="pd-profile-content">
        <div className="pd-profile-intro">
          <img
            src={patient?.image || patient?.avatar || patientPhoto}
            alt={displayName}
          />
          <h3>{displayName}</h3>
          <p>
            {profileDescription ||
              (isEditable ? `Patient ID: #${patient.id}` : "Platinum member")}
          </p>
        </div>
        <dl className="pd-profile-details">
          {displayedDetails.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>
                {isEditing ? (
                  <Input
                    aria-label={detail.label}
                    className="pd-profile-field"
                    name={detail.key}
                    value={draft[detail.key]}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        [event.target.name]: event.target.value,
                      }))
                    }
                  />
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}

export default PatientProfile;
