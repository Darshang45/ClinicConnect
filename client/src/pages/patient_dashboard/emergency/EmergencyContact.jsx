import { FiAlertTriangle, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/patient_dashboard.css";

const emergencyContacts = [
  { label: "Hospital emergency", value: "108", icon: FiPhone },
  { label: "Primary doctor", value: "Dr. Sarah Mitchell", icon: FiUser },
  { label: "Family contact", value: "Ananya Srivastava", icon: FiPhone },
  {
    label: "Nearest hospital",
    value: "Clinic Connect, 1.2 km",
    icon: FiMapPin,
  },
];

function EmergencyContact() {
  return (
    <Card className="pd-emergency-contact" id="emergency-contact">
      <div className="pd-section-heading">
        <h2>Emergency Contact</h2>
        <FiAlertTriangle />
      </div>
      <div className="pd-emergency-list">
        {emergencyContacts.map(({ label, value, icon: Icon }) => (
          <div className="pd-emergency-item" key={label}>
            <Icon />
            <span>
              <small>{label}</small>
              <strong>{value}</strong>
            </span>
          </div>
        ))}
      </div>
      <Button className="pd-emergency-call">
        <FiPhone />
        Call emergency services
      </Button>
    </Card>
  );
}

export default EmergencyContact;
