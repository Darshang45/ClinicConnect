const features = [
  {
    icon: "medical_services",
    title: "Experienced Doctors",
    description:
      "Our team consists of internationally trained specialists with decades of experience in complex procedures.",
  },
  {
    icon: "emergency",
    title: "24/7 Emergency",
    description:
      "Round-the-clock critical care units equipped to handle trauma and acute medical emergencies instantly.",
  },
  {
    icon: "biotech",
    title: "Modern Technology",
    description: "Equipped with the latest robotic surgery systems, 3T MRI, and high-precision diagnostic tools.",
  },
];

function ClinicalExcellence() {
  return (
    <section className="clinical">
      <div className="clinical-inner">
        <div className="clinical-header">
          <h2 className="clinical-title">Our Clinical Excellence</h2>
          <p className="clinical-desc">
            We combine cutting-edge technology with empathy to provide the highest standards of healthcare for our
            community.
          </p>
        </div>

        <div className="clinical-grid">
          {features.map((feature) => (
            <div className="clinical-card hover-card" key={feature.title}>
              <div className="clinical-card-icon">
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClinicalExcellence;
