import { useState } from "react";
import { AppointmentForm } from "../../landing/appointment/Appointment";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import "../../../styles/reception_dashboard.css";

const initialPatientData = {
  firstName: "",
  lastName: "",
  dob: "",
  phone: "",
  email: "",
  gender: "",
  doctor: "",
  bloodGroup: "",
  height: "",
  weight: "",
  symptoms: "",
  appointmentStatus: "Waiting",
};

const fields = [
  { label: "First Name", name: "firstName", placeholder: "John", required: true },
  { label: "Last Name", name: "lastName", placeholder: "Doe", required: true },
  { label: "Date of Birth", name: "dob", type: "date", required: true },
  { label: "Phone Number", name: "phone", placeholder: "+1 (555) 000-0000", type: "tel", required: true },
  { label: "Email Address", name: "email", placeholder: "john@example.com", type: "email", required: true },
  { label: "Gender", name: "gender", as: "select", options: ["Female", "Male", "Non-binary", "Prefer not to say"], required: true },
  { label: "Select Doctor", name: "doctor", as: "select", options: ["General Physician", "Paediatrician / Gynaecologist"], required: true },
  { label: "Blood Group", name: "bloodGroup", as: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
  { label: "Height", name: "height", placeholder: "e.g. 170 cm", required: true },
  { label: "Weight", name: "weight", placeholder: "e.g. 68 kg", required: true },
];

function PatientRegistration({
  additionalFields = [],
  onRegister,
  submitLabel = "Submit Registration",
  title = "Patient Registration",
}) {
  const getInitialData = () => additionalFields.reduce(
    (data, field) => ({ ...data, [field.name]: "" }),
    { ...initialPatientData },
  );
  const [patientData, setPatientData] = useState(getInitialData);
  const registrationFields = [...fields, ...additionalFields];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPatientData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister?.(patientData);
    setPatientData(getInitialData());
  };

  return (
    <section className="rc-registration-section">
      <div className="rc-section-heading rc-title-with-icon">
        <h2>{title}</h2>
        <span aria-label="Patient information">ⓘ</span>
      </div>
      <Card className="rc-registration-card">
        <AppointmentForm className="rc-registration-form" onSubmit={handleSubmit}>
          <div className="rc-form-grid">
            {registrationFields.map(({ options, ...field }) => (
              <Input
                {...field}
                className="rc-form-field"
                key={field.name}
                value={patientData[field.name]}
                onChange={handleChange}
              >
                {options && <><option value="">Select {field.label}</option>{options.map((option) => <option key={option}>{option}</option>)}</>}
              </Input>
            ))}
          </div>
          <Input
            as="textarea"
            className="rc-form-field"
            label="Brief Description of Symptoms"
            name="symptoms"
            placeholder="Describe the patient's symptoms"
            required
            rows="4"
            value={patientData.symptoms}
            onChange={handleChange}
          />
          <Button className="rc-form-submit" type="submit">{submitLabel}</Button>
        </AppointmentForm>
      </Card>
    </section>
  );
}

export default PatientRegistration;
