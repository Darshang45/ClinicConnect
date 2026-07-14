import { FiEdit3 } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import patientPhoto from "../../../assets/images/hero/patient1.jpg";
import "../../../styles/patient_dashboard.css";

const profileDetails = [{ label: "Age", value: "28 years" }, { label: "Gender", value: "Male" }, { label: "Blood group", value: "O+" }, { label: "Height", value: "178 cm" }, { label: "Weight", value: "72 kg" }, { label: "Allergies", value: "No known allergies" }, { label: "Chronic diseases", value: "Hypertension" }, { label: "Emergency contact", value: "Ananya Srivastava" }, { label: "Insurance", value: "CareSecure Health" }];

function PatientProfile() { return <Card className="pd-profile-card" id="patient-profile"><div className="pd-section-heading"><h2>Patient Profile</h2><Button className="pd-profile-edit"><FiEdit3 />Edit profile</Button></div><div className="pd-profile-content"><div className="pd-profile-intro"><img src={patientPhoto} alt="Atharva Srivastava" /><h3>Atharva Srivastava</h3><p>Platinum member</p></div><dl className="pd-profile-details">{profileDetails.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl></div></Card>; }

export default PatientProfile;
