import { useEffect, useState } from "react";
import { getPublicDepartments } from "../../../services/appointmentService";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";

// Icon mapping for department names to Material Symbols icons
const DEPARTMENT_ICONS = {
  cardiology: "cardiology",
  neurology: "neurology",
  orthopedics: "orthopedics",
  pediatrics: "child_care",
  paediatrics: "child_care",
  dermatology: "dermatology",
  "general medicine": "stethoscope",
  "general surgery": "surgical",
  gynecology: "pregnant_woman",
  gynaecology: "pregnant_woman",
  ophthalmology: "visibility",
  oncology: "biotech",
  radiology: "radiology",
  dentistry: "dentistry",
  psychiatry: "psychology",
  urology: "nephrology",
  nephrology: "nephrology",
  gastroenterology: "gastroenterology",
  pulmonology: "lungs",
  endocrinology: "science",
  rheumatology: "accessibility",
};

function getDeptIcon(name = "") {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(DEPARTMENT_ICONS)) {
    if (key.includes(k)) return v;
  }
  return "local_hospital";
}

function Departments() {
  const { updateAppointment } = useAppointmentBooking();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await getPublicDepartments();
        setDepartments(response.departments || []);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handleBookClick = (event, department) => {
    event.preventDefault();
    updateAppointment({ departmentId: department._id, doctorId: "" });
    const target = document.querySelector("#book");
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <section className="departments" id="departments">
      <div className="departments-header">
        <span className="departments-badge">Clinical Excellence</span>
        <h2>Specialized Care Departments</h2>
        <p>World-class medical expertise supported by advanced diagnostic technology across multiple specialties.</p>
      </div>

      <div className="departments-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div className="department-card department-card-skeleton" key={i}>
                <div className="department-icon department-icon-skeleton" />
                <div className="dept-skeleton-name" />
                <div className="dept-skeleton-desc" />
              </div>
            ))
          : departments.map((dept) => (
              <div className="department-card" key={dept._id}>
                <div className="department-icon">
                  <span className="material-symbols-outlined">
                    {getDeptIcon(dept.name)}
                  </span>
                </div>
                <h3>{dept.name}</h3>
                <p>
                  {dept.description ||
                    `Comprehensive care with a consultation duration of ${dept.consultationDuration} min. Fee: ₹${dept.consultationFee}.`}
                </p>
                <a
                  href="#book"
                  className="department-link"
                  onClick={(event) => handleBookClick(event, dept)}
                >
                  Book Appointment <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
            ))}
      </div>
    </section>
  );
}

export default Departments;
