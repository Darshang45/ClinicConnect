const facilities = [
  { icon: "emergency", label: "Emergency", color: "error" },
  { icon: "medical_services", label: "ICU Unit", color: "primary" },
  { icon: "medication", label: "Pharmacy", color: "primary" },
  { icon: "biotech", label: "Laboratory", color: "primary" },
  { icon: "api", label: "MRI Scan", color: "primary" },
  { icon: "bloodtype", label: "Blood Bank", color: "error" },
  { icon: "airport_shuttle", label: "Ambulance", color: "primary" },
];

function Facilities() {
  return (
    <section className="facilities" id="facilities">
      <div className="facilities-header">
        <h2>Advanced Facilities</h2>
        <p>Our center is equipped with cutting-edge medical infrastructure.</p>
      </div>

      <div className="facilities-grid">
        {facilities.map((item) => (
          <div className="facility-card" key={item.label}>
            <span className={`material-symbols-outlined facility-icon facility-icon-${item.color}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Facilities;
