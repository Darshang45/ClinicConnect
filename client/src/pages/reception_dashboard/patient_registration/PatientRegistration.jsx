import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";

export function Input({ label, type = "text", placeholder }) {
  return (
    <label className="rc-form-field">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} />
    </label>
  );
}

function PatientRegistration() {
  return (
    <section className="rc-registration-section">
      <div className="rc-section-heading rc-title-with-icon">
        <h2>Patient Registration</h2>
        <span aria-label="Patient information">ⓘ</span>
      </div>
      <Card className="rc-registration-card">
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="rc-form-grid">
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
            <Input label="Date of Birth" type="date" />
            <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <Input label="Emergency Contact Name" placeholder="Full name of contact" />
          <Button className="rc-form-submit" type="submit">Submit Registration</Button>
        </form>
      </Card>
    </section>
  );
}

export default PatientRegistration;
