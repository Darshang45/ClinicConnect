import { useState } from "react";
import Button from "../../../components/common/Button";
import "../../../styles/doctor_dashboard.css";

function PatientSearch() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section className="doc-patient-search" aria-label="Patient search">
      <span className="material-symbols-outlined doc-search-person" aria-hidden="true">person_search</span>
      <span className="doc-search-divider" aria-hidden="true" />
      <input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search for any patient by name, ID, or phone..."
        aria-label="Search for a patient"
      />
      <Button className="doc-search-button">
        <span className="material-symbols-outlined">search</span>
        Search
      </Button>
    </section>
  );
}

export default PatientSearch;
