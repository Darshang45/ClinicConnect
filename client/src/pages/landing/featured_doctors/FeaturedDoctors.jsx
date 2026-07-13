import { featuredDoctors } from "../data/doctors";


  

function FeaturedDoctors() {
  const handleScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }
  };
  return (
    
    <section className="featured-doctors" id="doctors">
      <div className="featured-doctors-inner">
        <div className="featured-doctors-header">
          <div>
            <h2>Leading Specialists</h2>
            <p>Our department heads are pioneers in their respective fields.</p>
          </div>
          <button type="button" className="featured-doctors-link">
            View All Doctors <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="featured-doctors-grid">
          {featuredDoctors.map((doctor) => (
            <div className="featured-doctor-card" key={doctor.id}>
              <div className="featured-doctor-image">
                <img src={doctor.image} alt={doctor.name} />
              </div>
              <div className="featured-doctor-content">
                <div>
                  <span className="featured-doctor-role">{doctor.role}</span>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.bio}</p>
                </div>
                <div className="featured-doctor-footer">
                  <div className="featured-doctor-meta">
                    <div>
                      <span className="material-symbols-outlined filled">star</span>
                      <span>{doctor.rating}</span>
                    </div>
                    <div>
                      <span className="material-symbols-outlined">groups</span>
                      <span>{doctor.patients}</span>
                    </div>
                  </div>
                  <div className="featured-doctor-actions">
                    <button type="button" className="btn btn-primary btn-sm"  onClick={(e) => handleScroll(e, "#book")}>
                      Book
                    </button>
                    <a href="#" className="btn btn-outline btn-sm">
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDoctors;
