import heroImage from "../../../assets/images/hero/hero-doctors.jpg";
import patient1 from "../../../assets/images/hero/patient1.jpg";
import patient2 from "../../../assets/images/hero/patient2.jpg";

function Hero() {
  const handleScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="material-symbols-outlined">verified</span>
            <span>NABH Accredited Tertiary Care</span>
          </div>

          <h1 className="hero-title">
            Trusted <span className="text-primary">Healthcare</span> for Every Family
          </h1>

          <p className="hero-description">
            Experience world-class medical excellence combined with compassionate care. Our leading specialists and
            advanced technology ensure the best outcomes for you.
          </p>

          <div className="hero-buttons">
            <a href="#book" className="btn btn-primary btn-lg" onClick={(e) => handleScroll(e, "#book")}>
              Book Appointment <span className="material-symbols-outlined">calendar_month</span>
            </a>
            <button type="button" className="btn btn-emergency btn-lg">
              Emergency Support <span className="material-symbols-outlined">call</span>
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">20+</span>
              <span className="hero-stat-label">Years</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">50+</span>
              <span className="hero-stat-label">Doctors</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">15K+</span>
              <span className="hero-stat-label">Patients</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">24/7</span>
              <span className="hero-stat-label">Emergency</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-card">
            <img src={heroImage} alt="Medical team in hospital corridor" />

            <div className="hero-float-card hero-float-top">
              <div className="hero-float-icon">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div className="ml-">
                <span className="hero-float-title">Fast Booking</span>
                <span className="hero-float-sub">Under 2 mins</span>
              </div>
            </div>

            <div className="hero-float-card hero-float-bottom">
              <div className="hero-float-avatars">
                <img src={patient1} alt="Patient" />
                <img src={patient2} alt="Patient" />
                <div className="hero-float-rating">99%</div>
              </div>
              <div>
                <span className="hero-float-title">Patient Satisfaction</span>
                <span className="hero-float-sub">Highly Recommended</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
