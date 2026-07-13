import { departments } from "../data/departments";

function Departments() {
  return (
    <section className="departments" id="departments">
      <div className="departments-header">
        <span className="departments-badge">Clinical Excellence</span>
        <h2>Specialized Care Departments</h2>
        <p>World-class medical expertise supported by advanced diagnostic technology across multiple specialties.</p>
      </div>

      <div className="departments-grid">
        {departments.map((dept) => (
          <div className="department-card" key={dept.id}>
            <div className="department-icon">
              <span className="material-symbols-outlined">{dept.icon}</span>
            </div>
            <h3>{dept.name}</h3>
            <p>{dept.description}</p>
            <a href="#" className="department-link">
              Learn More <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Departments;
