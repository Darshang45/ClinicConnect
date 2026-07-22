import PatientRegistration from "../../reception_dashboard/patient_registration/PatientRegistration";

const doctorFields = [
  { label: "Doctor ID", name: "doctorId", placeholder: "DOC-1001", required: true },
  { label: "Specialization", name: "specialization", placeholder: "Cardiology", required: true },
  { label: "Department", name: "department", placeholder: "Cardiology", required: true },
  { label: "Qualification", name: "qualification", placeholder: "MBBS, MD", required: true },
  { label: "Years of Experience", name: "experience", placeholder: "10", required: true, type: "number" },
  { label: "Consultation Fee", name: "consultationFee", placeholder: "1250", required: true, type: "number" },
  { label: "OPD Timing", name: "opdTiming", placeholder: "10:00 AM - 2:00 PM", required: true },
  { label: "Address", name: "address", placeholder: "Clinic address", required: true },
];

function DoctorRegistration({ onRegister }) {
  return (
    <PatientRegistration
      additionalFields={doctorFields}
      onRegister={onRegister}
      submitLabel="Register Doctor"
      title="Doctor Registration"
    />
  );
}

export default DoctorRegistration;
