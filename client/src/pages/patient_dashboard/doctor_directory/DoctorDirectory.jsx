import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiStar } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { doctors as staticDoctors } from "../data/doctors";
import { getPatientDoctors } from "../../../services/patientService";
import "../../../styles/patient_dashboard.css";

function DoctorDirectory() {
  const navigate = useNavigate();
  const [doctorsList, setDoctorsList] = useState(staticDoctors);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getPatientDoctors();
        if (res?.data && res.data.length > 0) {
          setDoctorsList(res.data);
        } else if (res?.doctors && res.doctors.length > 0) {
          setDoctorsList(res.doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors for directory:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    const docId = doctor.doctorId || doctor._id || doctor.id;
    const deptId = doctor.departmentId || doctor.department?._id || doctor.department;
    const deptName = typeof doctor.department === "object" ? doctor.department?.name : (doctor.department || "General Medicine");
    const docName = doctor.name || doctor.fullName;

    navigate("/patient/book", {
      state: {
        doctorId: docId,
        departmentId: deptId,
        doctorName: docName,
        departmentName: deptName,
        isPrefilled: true,
      },
    });
  };

  return (
    <section className="pd-detail-section" id="my-doctors">
      <div className="pd-section-heading">
        <h2>Your Care Team</h2>
        <a href="#my-doctors">Find a doctor</a>
      </div>
      <div className="pd-doctor-directory-grid">
        {doctorsList.map((doctor) => {
          const docId = doctor.doctorId || doctor._id || doctor.id;
          const docName = doctor.name || doctor.fullName;
          const deptName = typeof doctor.department === "object" ? doctor.department?.name : doctor.department;
          const expYears = doctor.experience ? `${doctor.experience} yrs exp` : "8+ yrs exp";
          const feeDisplay = doctor.consultationFee ? `$${doctor.consultationFee}` : "$50";
          const availText = doctor.availability || (doctor.isAvailable ? "Available Today" : "Available");

          return (
            <Card className="pd-directory-card" key={docId}>
              <img src={doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"} alt={docName} />
              <div>
                <h3>{docName}</h3>
                <p style={{ margin: "2px 0", fontWeight: 600, color: "var(--pd-primary, #006b2c)" }}>
                  {deptName || "General Medicine"} • {doctor.specialization || "Physician"}
                </p>
                <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "var(--pd-muted, #536052)", margin: "4px 0" }}>
                  <span>{expYears}</span>
                  <span>•</span>
                  <span>Fee: {feeDisplay}</span>
                </div>
                <small>
                  <FiStar /> {doctor.rating || "4.9"} rating
                </small>
              </div>
              <span className="pd-availability">{availText}</span>
              <div className="pd-directory-actions">
                <Button
                  className="pd-compact-button"
                  onClick={() => handleBookAppointment(doctor)}
                >
                  Book appointment
                </Button>
                <Button
                  className="pd-message-button"
                  aria-label={`Message ${docName}`}
                >
                  <FiMessageCircle />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default DoctorDirectory;
