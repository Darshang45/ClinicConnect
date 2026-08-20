import { useState, useEffect } from "react";
import { FiEdit3, FiX } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import patientPhoto from "../../../assets/images/hero/patient1.jpg";
import ProfilePhotoUpload from "../../../components/common/ProfilePhotoUpload";
import "../../../styles/patient_dashboard.css";

const defaultProfileDetails = [
  { label: "First name", value: "firstName" },
  { label: "Last name", value: "lastName" },
  { label: "Gender", value: "gender" },
  { label: "Blood group", value: "bloodGroup" },
  { label: "Age", value: "age" },
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "Address", value: "address" },
  { label: "Allergies", value: "allergies" },
  { label: "Chronic diseases", value: "chronicDiseases" },
  { label: "Emergency contact", value: "emergencyContact" },
  { label: "Insurance", value: "insurance" },
];

const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formatEmergencyContactSummary = (ec) => {
  if (!ec) return "Not provided";
  if (typeof ec === "string") return ec || "Not provided";
  if (typeof ec === "object") {
    const parts = [
      ec.name,
      ec.relation ? `(${ec.relation})` : "",
      ec.phone ? `- ${ec.phone}` : "",
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : "Not provided";
  }
  return "Not provided";
};

const getSummaryProfileDetails = (patient) => [
  { label: "First name", key: "firstName", value: patient?.firstName || "" },
  { label: "Last name", key: "lastName", value: patient?.lastName || "" },
  { label: "Gender", key: "gender", value: patient?.gender || "" },
  { label: "Blood group", key: "bloodGroup", value: patient?.bloodGroup || "" },
  { label: "Age", key: "age", value: patient?.age ?? "" },
  { label: "Phone", key: "phone", value: patient?.phone || "" },
  { label: "Email", key: "email", value: patient?.email || "", readOnly: true },
  { label: "Address", key: "address", value: patient?.address || "" },
  { label: "Allergies", key: "allergies", value: patient?.allergies || "None" },
  { label: "Chronic diseases", key: "chronicDiseases", value: patient?.chronicDiseases || "None" },
  {
    label: "Emergency contact",
    key: "emergencyContact",
    value: formatEmergencyContactSummary(patient?.emergencyContact),
  },
  { label: "Insurance", key: "insurance", value: patient?.insurance || "Not provided" },
];

const editableFields = [
  { label: "First name", key: "firstName" },
  { label: "Last name", key: "lastName" },
  { label: "Gender", key: "gender" },
  { label: "Blood group", key: "bloodGroup" },
  { label: "Age", key: "age", readOnly: true },
  { label: "Phone", key: "phone" },
  { label: "Email", key: "email", readOnly: true },
  { label: "Address", key: "address" },
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
  age: patient?.age ?? "",
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
  onPhotoChange,
  photoResetKey,
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
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState("");

  useEffect(() => {
    setDraft(
      isCustomProfile
        ? normaliseCustomProfile(patient, formFields)
        : normalisePatient(patient)
    );
    setSelectedPhotoPreview("");
  }, [patient]);

  useEffect(() => {
    setSelectedPhotoPreview("");
  }, [photoResetKey]);

  useEffect(
    () => () => {
      if (selectedPhotoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(selectedPhotoPreview);
      }
    },
    [selectedPhotoPreview],
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
            value: draft[field.key] || "",
          }))
        : defaultProfileDetails;
  const displayName = isCustomProfile
    ? draft.name || patient?.name || "Administrator"
    : isEditable
      ? `${draft.firstName || ""} ${draft.lastName || ""}`.trim() || patient?.name || "Patient"
      : "Patient";
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
            src={selectedPhotoPreview || patient?.profilePhoto || patient?.image || patient?.avatar || patientPhoto}
            alt={displayName}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = patientPhoto;
            }}
          />
          <h3>{displayName}</h3>
          <p>
            {profileDescription ||
              (isEditable ? `Patient ID: #${patient?.id || patient?.patientId || "N/A"}` : "Platinum member")}
          </p>
        </div>
        <dl className="pd-profile-details">
          {displayedDetails.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>
                {isEditing ? (
                  detail.key === "gender" ? (
                    <select
                      aria-label="Gender"
                      className="pd-profile-field"
                      name="gender"
                      value={draft.gender || ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          gender: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : detail.key === "bloodGroup" ? (
                    <select
                      aria-label="Blood Group"
                      className="pd-profile-field"
                      name="bloodGroup"
                      value={draft.bloodGroup || ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          bloodGroup: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select blood group</option>
                      {bloodGroupOptions.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  ) : detail.key === "age" ? (
                    <Input
                      aria-label="Age"
                      className="pd-profile-field"
                      name="age"
                      type="text"
                      value={draft.age !== null && draft.age !== undefined && draft.age !== "" ? `${draft.age} years` : "Not specified"}
                      disabled
                      readOnly
                    />
                  ) : detail.key === "emergencyContact" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                      <Input
                        aria-label="Emergency Contact Name"
                        className="pd-profile-field"
                        placeholder="Contact Name"
                        name="emergencyContactName"
                        value={
                          typeof draft.emergencyContact === "object" && draft.emergencyContact !== null
                            ? draft.emergencyContact.name || ""
                            : typeof draft.emergencyContact === "string"
                            ? draft.emergencyContact
                            : ""
                        }
                        onChange={(event) =>
                          setDraft((current) => {
                            const prevObj = typeof current.emergencyContact === "object" && current.emergencyContact !== null ? current.emergencyContact : {};
                            return {
                              ...current,
                              emergencyContact: { ...prevObj, name: event.target.value },
                            };
                          })
                        }
                      />
                      <Input
                        aria-label="Emergency Contact Relation"
                        className="pd-profile-field"
                        placeholder="Relation (e.g. Spouse, Parent)"
                        name="emergencyContactRelation"
                        value={
                          typeof draft.emergencyContact === "object" && draft.emergencyContact !== null
                            ? draft.emergencyContact.relation || ""
                            : ""
                        }
                        onChange={(event) =>
                          setDraft((current) => {
                            const prevObj = typeof current.emergencyContact === "object" && current.emergencyContact !== null ? current.emergencyContact : {};
                            return {
                              ...current,
                              emergencyContact: { ...prevObj, relation: event.target.value },
                            };
                          })
                        }
                      />
                      <Input
                        aria-label="Emergency Contact Phone"
                        className="pd-profile-field"
                        placeholder="Phone (10 digits)"
                        name="emergencyContactPhone"
                        inputMode="numeric"
                        maxLength="10"
                        value={
                          typeof draft.emergencyContact === "object" && draft.emergencyContact !== null
                            ? draft.emergencyContact.phone || ""
                            : ""
                        }
                        onChange={(event) =>
                          setDraft((current) => {
                            const prevObj = typeof current.emergencyContact === "object" && current.emergencyContact !== null ? current.emergencyContact : {};
                            return {
                              ...current,
                              emergencyContact: { ...prevObj, phone: event.target.value.replace(/\D/g, "") },
                            };
                          })
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      aria-label={detail.label}
                      className="pd-profile-field"
                      name={detail.key}
                      value={draft[detail.key] || ""}
                      disabled={detail.readOnly || detail.key === "email" || detail.key === "id"}
                      readOnly={detail.readOnly || detail.key === "email" || detail.key === "id"}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          [event.target.name]: event.target.value,
                        }))
                      }
                    />
                  )
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
          {onPhotoChange && isEditing && (
            <div className="pd-profile-photo-field">
              <dt>Profile Photo</dt>
              <dd>
                <ProfilePhotoUpload
                  currentPhoto={patient?.profilePhoto || patient?.image || patient?.avatar}
                  fallbackImage={patientPhoto}
                  onFileChange={onPhotoChange}
                  onPreviewChange={setSelectedPhotoPreview}
                  resetKey={photoResetKey}
                  showPreview={false}
                />
              </dd>
            </div>
          )}
        </dl>
      </div>
    </Card>
  );
}

export default PatientProfile;
