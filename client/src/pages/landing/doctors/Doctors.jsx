import { useEffect, useState } from "react";
import { getPublicDepartments, getPublicDoctorsByDepartment } from "../../../services/appointmentService";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";
import getAssetUrl from "../../../utils/getAssetUrl";

import doctor3 from "../../../assets/images/doctors/doctor-3.jpg";
import doctor4 from "../../../assets/images/doctors/doctor-4.jpg";
import doctor5 from "../../../assets/images/doctors/doctor-5.jpg";
import doctor6 from "../../../assets/images/doctors/doctor-6.jpg";

const FALLBACK_IMAGES = [doctor3, doctor4, doctor5, doctor6];

function Doctors() {
  const { updateAppointment } = useAppointmentBooking();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const deptResponse = await getPublicDepartments();
        const departments = deptResponse.departments || [];
        setDepartments(departments);

        const allDoctorArrays = await Promise.all(
          departments.map((dept) =>
            getPublicDoctorsByDepartment(dept._id)
              .then((res) =>
                (res.doctors || []).map((doc) => ({
                  ...doc,
                  departmentId: dept._id,
                  departmentName: doc.department?.name || dept.name,
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

        // Store all unique doctors so landing page doctor search/filter checks all doctors
        setDoctors(unique);
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
      departmentId: doctor.departmentId || doctor.department?._id,
      doctorId: doctor._id,
    });
    const target = document.querySelector("#book");
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleDoctors = doctors.filter((doctor) => {
    const matchesDepartment =
      !departmentFilter ||
      doctor.departmentId === departmentFilter ||
      doctor.department?._id === departmentFilter;
    const searchable = [
      doctor.user?.fullName,
      doctor.fullName,
      doctor.departmentName,
      doctor.department?.name,
      doctor.specialization,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesDepartment && (!normalizedSearch || searchable.includes(normalizedSearch));
  });

  if (loading) return null;

  return (
    <section className="other-doctors">
      <div className="other-doctors-inner">
        <h3>Other Specialists</h3>
        <div className="other-doctors-filters">
          <label className="other-doctors-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by doctor, department, or specialization"
              aria-label="Search doctors"
            />
          </label>
          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            aria-label="Filter doctors by department"
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        {visibleDoctors.length === 0 ? (
          <div className="other-doctors-empty">
            <span className="material-symbols-outlined">search_off</span>
            <p>No doctors found for this search.</p>
          </div>
        ) : (
          <div className="other-doctors-grid">
            {visibleDoctors.map((doctor, idx) => {
              const photo =
                doctor.profilePhoto ||
                FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

              return (
                <div className="other-doctor-card" key={doctor._id}>
                  <img
                  src={getAssetUrl(photo)}
                    alt={doctor.user?.fullName || "Doctor"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                    }}
                  />
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
        )}
      </div>
    </section>
  );
}

export default Doctors;
