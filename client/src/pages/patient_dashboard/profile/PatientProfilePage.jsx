import { useState } from "react";
import PatientDashboardPage from "../PatientDashboardPage";
import PatientProfile from "./PatientProfile";

const initialPatient = {
  id: "PT-1001",
  name: "Atharva Srivastava",
  age: "28 years",
  gender: "Male",
  bloodGroup: "O+",
  height: "178 cm",
  weight: "72 kg",
  allergies: "No known allergies",
  chronicDiseases: "Hypertension",
  emergencyContact: "Ananya Srivastava",
  insurance: "CareSecure Health",
  phone: "",
  email: "",
  address: "",
  doctor: "",
  symptoms: "",
};

function PatientProfilePage() {
  const [patient, setPatient] = useState(initialPatient);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const toggleProfileEditing = () => {
    setIsProfileEditing((isOpen) => !isOpen);
  };

  return (
    <PatientDashboardPage>
      <PatientProfile
        isEditing={isProfileEditing}
        isReceptionPanel={false}
        onClose={isProfileEditing ? toggleProfileEditing : undefined}
        onToggleEdit={toggleProfileEditing}
        onUpdate={setPatient}
        patient={patient}
      />
    </PatientDashboardPage>
  );
}

export default PatientProfilePage;
