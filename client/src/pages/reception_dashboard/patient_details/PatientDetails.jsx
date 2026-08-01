import { useMemo, useState } from "react";
import { MdDescription, MdSearch } from "react-icons/md";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import patient, { patients } from "../data/patient";

function PatientDetails({ onEditProfile, onSelectPatient, selectedPatient }) {
  const [localPatient, setLocalPatient] = useState(patient);
  const [searchTerm, setSearchTerm] = useState("");
  const activePatient = selectedPatient || localPatient;
  const matchingPatients = useMemo(
    () => patients.filter(({ id, name }) => `${name} ${id}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm],
  );
  const profileFacts = [
    { label: "Phone", value: activePatient.phone },
    { label: "Email", value: activePatient.email },
    { label: "Address", value: activePatient.address },
    { label: "Blood Group", value: activePatient.bloodGroup },
    { label: "Height", value: activePatient.height },
    { label: "Weight", value: activePatient.weight },
    { label: "Gender", value: activePatient.gender },
  ].filter(({ value }) => value);

  const selectPatient = (nextPatient) => {
    if (onSelectPatient) onSelectPatient(nextPatient);
    else setLocalPatient(nextPatient);
    setSearchTerm("");
  };

  return (
    <section className="rc-patient-details-section">
      <div className="rc-section-heading"><h2>Selected Patient Details</h2></div>
      <div className="rc-selected-patient-search">
        <label>
          <MdSearch />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patients by name or ID"
            aria-label="Search patients"
            aria-controls="patient-search-results"
          />
        </label>
        {searchTerm && (
          <div className="rc-patient-search-results" id="patient-search-results">
            {matchingPatients.length > 0 ? matchingPatients.map((nextPatient) => (
              <button type="button" key={nextPatient.id} onClick={() => selectPatient(nextPatient)}>
                <img src={nextPatient.image} alt="" />
                <span><strong>{nextPatient.name}</strong><small>Patient ID: #{nextPatient.id}</small></span>
              </button>
            )) : <p>No matching patients found.</p>}
          </div>
        )}
      </div>
      <Card className="rc-patient-card">
        <header className="rc-patient-card-header">
          <img src={activePatient.image} alt={activePatient.name} />
          <div>
            <h3>{activePatient.name}</h3>
            <p>{activePatient.details}</p>
            <div className="rc-medical-alerts">
              {activePatient.alerts.map((alert) => <span className={alert === "No known allergies" ? "safe" : "danger"} key={alert}>{alert}</span>)}
            </div>
          </div>
        </header>
        <div className="rc-patient-card-content">
          <div className="rc-patient-facts">
            <div><span>Last Visit</span><strong>{activePatient.lastVisit}</strong></div>
            <div><span>Primary Doctor</span><strong>{activePatient.doctor || activePatient.primaryDoctor}</strong></div>
            {profileFacts.map((fact) => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}
          </div>
          <div className="rc-history">
            <span>Recent History</span>
            <div className="rc-report-item">
              <MdDescription />
              <div><strong>{activePatient.report}</strong><small>{activePatient.reportDate}</small></div>
              <Button>View</Button>
            </div>
          </div>
          <div className="rc-patient-buttons">
            <Button onClick={onEditProfile}>Edit Profile</Button>
            <Button>Schedule Visit</Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default PatientDetails;
