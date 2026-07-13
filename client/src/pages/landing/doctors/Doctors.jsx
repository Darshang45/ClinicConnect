import { otherDoctors } from "../data/doctors";

function Doctors() {
  return (
    <section className="other-doctors">
      <div className="other-doctors-inner">
        <h3>Other Specialists</h3>
        <div className="other-doctors-grid">
          {otherDoctors.map((doctor) => (
            <div className="other-doctor-card" key={doctor.id}>
              <img src={doctor.image} alt={doctor.name} />
              <h4>{doctor.name}</h4>
              <p>{doctor.specialty}</p>
              <a href="#" className="other-doctor-link">
                View Dashboard <span className="material-symbols-outlined">open_in_new</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Doctors;
