import { MdRefresh } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import doctors from "../data/doctors";

export function DoctorCard({ doctor }) {
  return (
    <Card className="rc-doctor-card">
      <div className="rc-doctor-photo">
        <img src={doctor.image} alt={doctor.name} />
        <i className={doctor.tone} />
      </div>
      <div><h3>{doctor.name}</h3><p>{doctor.department}</p></div>
      <strong className={`rc-doctor-status ${doctor.tone}`}>{doctor.status}</strong>
      <span>{doctor.room}</span>
    </Card>
  );
}

function DoctorAvailability() {
  return (
    <section className="rc-doctors-section" id="doctors">
      <div className="rc-section-heading rc-doctors-heading">
        <h2>Doctor Availability</h2>
        <Button className="rc-refresh-button"><MdRefresh /> Refresh Status</Button>
      </div>
      <div className="rc-doctor-grid">
        {doctors.map((doctor) => <DoctorCard doctor={doctor} key={doctor.name} />)}
      </div>
    </section>
  );
}

export default DoctorAvailability;
