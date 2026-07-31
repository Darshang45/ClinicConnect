import PatientRegistration from "../../reception_dashboard/patient_registration/PatientRegistration";

const pharmacistFields = [
  { label: "Pharmacist ID", name: "pharmacistId", placeholder: "PHA-1001", required: true },
  { label: "Qualification", name: "qualification", placeholder: "B.Pharm", required: true },
  { label: "Experience", name: "experience", placeholder: "5", required: true, type: "number" },
  { label: "Address", name: "address", placeholder: "Home address", required: true },
];

function PharmacyRegistration({ onRegister }) {
  return (
    <PatientRegistration
      additionalFields={pharmacistFields}
      onRegister={onRegister}
      submitLabel="Register Pharmacist"
      title="Pharmacist Registration"
    />
  );
}

export default PharmacyRegistration;
