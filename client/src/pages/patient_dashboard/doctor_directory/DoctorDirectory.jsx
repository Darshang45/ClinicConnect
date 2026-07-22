import { FiMessageCircle, FiStar } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { doctors } from "../data/doctors";
import "../../../styles/patient_dashboard.css";

function DoctorDirectory() {
  return (
    <section className="pd-detail-section" id="my-doctors">
      <div className="pd-section-heading">
        <h2>Your Care Team</h2>
        <a href="#my-doctors">Find a doctor</a>
      </div>
      <div className="pd-doctor-directory-grid">
        {doctors.map((doctor) => (
          <Card className="pd-directory-card" key={doctor.id}>
            <img src={doctor.image} alt={doctor.name} />
            <div>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
              <small>
                <FiStar /> {doctor.rating} rating
              </small>
            </div>
            <span className="pd-availability">{doctor.availability}</span>
            <div className="pd-directory-actions">
              <Button className="pd-compact-button">Book appointment</Button>
              <Button
                className="pd-message-button"
                aria-label={`Message ${doctor.name}`}
              >
                <FiMessageCircle />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default DoctorDirectory;
