import PatientRegistration from "../../reception_dashboard/patient_registration/PatientRegistration";

const receptionistFields = [
  { label: "Receptionist ID", name: "receptionistId", placeholder: "REC-1001", required: true },
  { label: "Address", name: "address", placeholder: "Home address", required: true },
];

function ReceptionRegistration({ onRegister }) {
  return (
    <PatientRegistration
      additionalFields={receptionistFields}
      onRegister={onRegister}
      submitLabel="Register Receptionist"
      title="Receptionist Registration"
    />
  );
}

export default ReceptionRegistration;
