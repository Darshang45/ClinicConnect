import hospital1 from "../../../assets/images/About/hospital-1.jpg";
import hospital2 from "../../../assets/images/About/hospital-2.jpg";

const timeline = [
  {
    step: 1,
    title: "2004 - Foundation",
    description: "LuxeHealth opened its first multispecialty wing with 50 beds.",
  },
  {
    step: 2,
    title: "2012 - Global Recognition",
    description: "Received JCI Accreditation for international quality standards.",
  },
  {
    step: 3,
    title: "2023 - Digital First",
    description: "Launched the fully automated Hospital Management Cloud platform.",
  },
];

function About() {
  return (
    <section className="about" id="about">
      <div className="about-grid">
        <div className="about-content">
          <h2 className="about-title">
            Defining the Future of <br />
            Healthcare Since 2004
          </h2>

          <div className="about-boxes">
            <div className="about-box about-box-mission">
              <h4>Our Mission</h4>
              <p>
                To provide accessible, high-quality healthcare using integrated clinical practice and advanced medical
                research.
              </p>
            </div>
            <div className="about-box about-box-vision">
              <h4>Our Vision</h4>
              <p>To be the global leader in medical innovation, patient safety, and compassionate care.</p>
            </div>
          </div>

          <div className="about-timeline timeline-line">
            {timeline.map((item) => (
              <div className="about-timeline-item" key={item.step}>
                <div className="about-timeline-step">{item.step}</div>
                <div>
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-gallery">
          <div className="about-gallery-left">
            <img src={hospital1} alt="Hospital atrium" />
          </div>
          <div className="about-gallery-right">
            <div className="about-gallery-top">
              <img src={hospital2} alt="Surgical robot" />
            </div>
            <div className="about-gallery-stat">
              <span className="about-stat-number">98%</span>
              <p>Recovery rate for critical cardiac surgeries last year.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
