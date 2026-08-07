import { useEffect, useState } from "react";
import { getPublicDepartments, getPublicDoctorsByDepartment } from "../../../services/appointmentService";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";

// Fallback local doctor images (cycled if DB has no profilePhoto)
import doctor1 from "../../../assets/images/doctors/doctor-1.jpg";
import doctor2 from "../../../assets/images/doctors/doctor-2.jpg";
import doctor3 from "../../../assets/images/doctors/doctor-3.jpg";
import doctor4 from "../../../assets/images/doctors/doctor-4.jpg";

const FALLBACK_IMAGES = [doctor1, doctor2, doctor3, doctor4];

function FeaturedDoctors() {
  const { updateAppointment } = useAppointmentBooking();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedDoctors = async () => {
      try {
        setLoading(true);
        // Fetch all departments, then load doctors from each
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

        // Flatten, de-duplicate by _id, take first 4 as featured
        const all = allDoctorArrays.flat();
        const seen = new Set();
        const unique = all.filter((d) => {
          if (seen.has(d._id)) return false;
          seen.add(d._id);
          return true;
        });

        setDoctors(unique.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedDoctors();
  }, []);

  const handleBookClick = (e, doctor) => {
    e.preventDefault();
    // Preselect department and doctor in context
    updateAppointment({
      departmentId: doctor.departmentId,
      doctorId: doctor._id,
    });
    // Smooth scroll to appointment form
    const target = document.querySelector("#book");
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="featured-doctors" id="doctors">
        <div className="featured-doctors-inner">
          <div className="featured-doctors-header">
            <div>
              <h2>Leading Specialists</h2>
              <p>Our department heads are pioneers in their respective fields.</p>
            </div>
          </div>
          <div className="featured-doctors-grid">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="featured-doctor-card featured-doctor-skeleton" key={i}>
                <div className="featured-doctor-image featured-doctor-image-skeleton" />
                <div className="featured-doctor-content">
                  <div className="fd-skeleton-role" />
                  <div className="fd-skeleton-name" />
                  <div className="fd-skeleton-bio" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-doctors" id="doctors">
      <div className="featured-doctors-inner">
        <div className="featured-doctors-header">
          <div>
            <h2>Leading Specialists</h2>
            <p>Our department heads are pioneers in their respective fields.</p>
          </div>
          {/* <button type="button" className="featured-doctors-link">
            View All Doctors <span className="material-symbols-outlined">arrow_forward</span>
          </button> */}
        </div>

        <div className="featured-doctors-grid">
          {doctors.map((doctor, idx) => {
            const photo =
              doctor.profilePhoto ||
              FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

            return (
              <div className="featured-doctor-card" key={doctor._id}>
                <div className="featured-doctor-image">
                  <img src={photo} alt={doctor.user?.fullName || "Doctor"} />
                </div>
                <div className="featured-doctor-content">
                  <div>
                    <span className="featured-doctor-role">
                      {doctor.department?.name || "Specialist"}
                    </span>
                    <h3>{doctor.user?.fullName}</h3>
                    <p>
                      {doctor.bio ||
                        `${doctor.specialization}${doctor.experience ? ` · ${doctor.experience} yrs experience` : ""}`}
                    </p>
                  </div>
                  <div className="featured-doctor-footer">
                    <div className="featured-doctor-meta">
                      <div>
                        <span className="material-symbols-outlined">work</span>
                        <span>{doctor.experience ? `${doctor.experience} yrs` : "Experienced"}</span>
                      </div>
                      <div>
                        <span className="material-symbols-outlined">payments</span>
                        <span>₹{doctor.consultationFee}</span>
                      </div>
                    </div>
                    <div className="featured-doctor-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={(e) => handleBookClick(e, doctor)}
                      >
                        Book
                      </button>
                      <a href="#" className="btn btn-outline btn-sm">
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDoctors;
