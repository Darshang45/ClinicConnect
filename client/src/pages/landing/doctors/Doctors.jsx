import { useEffect, useState } from "react";
import { getPublicDepartments, getPublicDoctorsByDepartment } from "../../../services/appointmentService";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";

import doctor3 from "../../../assets/images/doctors/doctor-3.jpg";
import doctor4 from "../../../assets/images/doctors/doctor-4.jpg";
import doctor5 from "../../../assets/images/doctors/doctor-5.jpg";
import doctor6 from "../../../assets/images/doctors/doctor-6.jpg";

const FALLBACK_IMAGES = [doctor3, doctor4, doctor5, doctor6];

function Doctors() {
  const { updateAppointment } = useAppointmentBooking();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const deptResponse = await getPublicDepartments();
        const departments = deptResponse.departments || [];

        const allDoctorArrays = await Promise.all(
          departments.map((dept) =>
            getPublicDoctorsByDepartment(dept._id)
              .then((res) =>
                (res.doctors || []).map((doc) => ({
                  ...doc,
                  departmentId: dept._id,
                }))
              )
              .catch(() => [])
          )
        );

        const all = allDoctorArrays.flat();
        const seen = new Set();
        const unique = all.filter((d) => {
          if (seen.has(d._id)) return false;
          seen.add(d._id);
          return true;
        });

        // Skip the first 4 (shown in FeaturedDoctors), show the rest (up to 8)
        setDoctors(unique.slice(4, 12));
      } catch (error) {
        console.error("Failed to load other doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const handleBookClick = (e, doctor) => {
    e.preventDefault();
    updateAppointment({
      departmentId: doctor.departmentId,
      doctorId: doctor._id,
    });
    const target = document.querySelector("#book");
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }
  };

  if (loading || doctors.length === 0) return null;

  return (
    <section className="other-doctors">
      <div className="other-doctors-inner">
        <h3>Other Specialists</h3>
        <div className="other-doctors-grid">
          {doctors.map((doctor, idx) => {
            const photo =
              doctor.profilePhoto ||
              FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

            return (
              <div className="other-doctor-card" key={doctor._id}>
                <img src={photo} alt={doctor.user?.fullName || "Doctor"} />
                <h4>{doctor.user?.fullName}</h4>
                <p>{doctor.specialization || doctor.department?.name}</p>
                <button
                  type="button"
                  className="other-doctor-link"
                  onClick={(e) => handleBookClick(e, doctor)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Book Appointment <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Doctors;
