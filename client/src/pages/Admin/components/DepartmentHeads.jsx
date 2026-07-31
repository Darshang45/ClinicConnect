import { departmentHeads } from "../data/dashboard";
import { Card } from "./common";

function DepartmentHeads() {
  return (
    <section className="full-span">
      <h4 className="section-title">Department Heads</h4>
      <div className="doctor-grid">
        {departmentHeads.map((doctor) => (
          <Card className="doctor-card" key={doctor.id} padded={false}>
            <img src={doctor.image} alt={doctor.alt} />
            <div>
              <p className="doctor-name">{doctor.name}</p>
              <p className="doctor-department">{doctor.department}</p>
              <div
                className={`doctor-status ${doctor.statusTone === "success" ? "" : doctor.statusTone}`.trim()}
              >
                <span className="status-dot" aria-hidden="true" />
                <span>{doctor.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default DepartmentHeads;
