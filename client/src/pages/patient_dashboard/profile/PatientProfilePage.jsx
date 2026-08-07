import { useState, useEffect } from "react";
import PatientDashboardPage from "../PatientDashboardPage";
import PatientProfile from "./PatientProfile";
import { getPatientProfile, updatePatientProfile } from "../../../services/patientService";

const formatPatientFromBackend = (data) => {
  if (!data) return null;

  const [firstName = "", ...lastNameParts] = (data.fullName || "").split(" ");
  const lastName = lastNameParts.join(" ");

  const age = data.age !== undefined && data.age !== null ? data.age : "";

  let emergencyContact = "";
  if (typeof data.emergencyContact === "string") {
    emergencyContact = data.emergencyContact;
  } else if (data.emergencyContact && typeof data.emergencyContact === "object") {
    emergencyContact = data.emergencyContact.name || "";
    if (data.emergencyContact.phone) {
      emergencyContact += ` (${data.emergencyContact.phone})`;
    }
  }

  let insurance = "";
  if (typeof data.insurance === "string") {
    insurance = data.insurance;
  } else if (data.insurance && typeof data.insurance === "object") {
    insurance = data.insurance.provider || "";
  }

  let allergies = "";
  if (Array.isArray(data.allergies)) {
    allergies = data.allergies.join(", ");
  } else if (typeof data.allergies === "string") {
    allergies = data.allergies;
  }

  let chronicDiseases = "";
  if (Array.isArray(data.chronicDiseases)) {
    chronicDiseases = data.chronicDiseases.join(", ");
  } else if (typeof data.chronicDiseases === "string") {
    chronicDiseases = data.chronicDiseases;
  }

  return {
    id: data.patientId || "",
    patientId: data.patientId || "",
    name: data.fullName || "",
    firstName,
    lastName,
    fullName: data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",
    gender: data.gender || "",
    bloodGroup: data.bloodGroup || "",
    dateOfBirth: data.dateOfBirth || "",
    age: age,
    address: data.address || "",
    emergencyContact: typeof data.emergencyContact === "object" && data.emergencyContact !== null ? data.emergencyContact : emergencyContact || "Not provided",
    insurance: insurance || "Not provided",
    allergies: allergies || "None",
    chronicDiseases: chronicDiseases || "None",
  };
};

function PatientProfilePage() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getPatientProfile();
      if (res.success && res.patient) {
        setPatient(formatPatientFromBackend(res.patient));
      }
    } catch (err) {
      console.error("Error fetching patient profile:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || "Unable to load profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleProfileEditing = () => {
    setIsProfileEditing((isOpen) => !isOpen);
  };

  const handleUpdateProfile = async (updatedDraft) => {
    try {
      setStatusMessage(null);
      const fullName = `${updatedDraft.firstName || ""} ${updatedDraft.lastName || ""}`.trim() || updatedDraft.name || updatedDraft.fullName;

      const payload = {
        fullName,
        phone: updatedDraft.phone,
        gender: updatedDraft.gender,
        bloodGroup: updatedDraft.bloodGroup,
        address: updatedDraft.address,
        allergies: typeof updatedDraft.allergies === "string"
          ? updatedDraft.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : updatedDraft.allergies,
        chronicDiseases: typeof updatedDraft.chronicDiseases === "string"
          ? updatedDraft.chronicDiseases.split(",").map((s) => s.trim()).filter(Boolean)
          : updatedDraft.chronicDiseases,
        emergencyContact: typeof updatedDraft.emergencyContact === "object" && updatedDraft.emergencyContact !== null
          ? updatedDraft.emergencyContact
          : { name: updatedDraft.emergencyContact },
        insurance: typeof updatedDraft.insurance === "string"
          ? { provider: updatedDraft.insurance }
          : updatedDraft.insurance,
      };

      const res = await updatePatientProfile(payload);
      if (res.success) {
        if (res.patient) {
          setPatient(formatPatientFromBackend(res.patient));
        } else {
          await fetchProfile();
        }
        setIsProfileEditing(false);
        setStatusMessage({
          type: "success",
          text: "Profile updated successfully.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: res.message || "Unable to update profile. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || "Unable to update profile. Please try again.",
      });
    }
  };

  return (
    <PatientDashboardPage>
      {statusMessage && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "8px",
            backgroundColor: statusMessage.type === "success" ? "#d1fae5" : "#fee2e2",
            color: statusMessage.type === "success" ? "#065f46" : "#991b1b",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "inherit",
            }}
          >
            ×
          </button>
        </div>
      )}
      {loading ? (
        <div style={{ padding: "24px", textAlign: "center" }}>Loading profile...</div>
      ) : (
        <PatientProfile
          isEditing={isProfileEditing}
          isReceptionPanel={false}
          onClose={isProfileEditing ? toggleProfileEditing : undefined}
          onToggleEdit={toggleProfileEditing}
          onUpdate={handleUpdateProfile}
          patient={patient}
        />
      )}
    </PatientDashboardPage>
  );
}

export default PatientProfilePage;
