import { useEffect, useState } from "react";

import { searchPatients } from "../../../services/doctorService";

import "../../../styles/doctor_dashboard.css";

function PatientSearch({ onSelectPatient }) {
  const [searchValue, setSearchValue] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchValue.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await searchPatients(searchValue);

        setResults(response.patients || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <section className="doc-patient-search">
      <div className="doc-search-input">
        <span className="material-symbols-outlined">person_search</span>

        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search patient by name, Patient ID or phone..."
        />
      </div>

      {searchValue && (
        <div className="doc-search-results">
          {loading ? (
            <div className="doc-search-loading">Searching patients...</div>
          ) : results.length === 0 ? (
            <div className="doc-search-empty">No patients found.</div>
          ) : (
            results.map((patient) => (
              <div
                key={patient._id}
                className="doc-search-item"
                onClick={() => {
                  onSelectPatient(patient);

                  setSearchValue("");

                  setResults([]);
                }}
              >
                <div className="doc-search-patient">
  <strong>{patient.fullName}</strong>

  <small>{patient.patientId}</small>

  <p>{patient.phone}</p>

  {patient.hasAppointmentToday ? (
    <>
      <p className="doc-search-info">
        🕒{" "}
        {new Date(patient.appointmentTime).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <p className="doc-search-info">
        🎫 Token #{patient.tokenNumber}
      </p>
    </>
  ) : (
    <p className="doc-search-info">
      📅 Last Visit:{" "}
      {patient.lastVisit
        ? new Date(patient.lastVisit).toLocaleDateString("en-IN")
        : "No Previous Visit"}
    </p>
  )}
</div>

<div className="doc-search-tags">
  {patient.hasAppointmentToday ? (
    <>
      <span className="doc-search-badge active">
        Today's Appointment
      </span>

      <span
        className={`doc-search-status ${patient.appointmentStatus
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        {patient.appointmentStatus}
      </span>
    </>
  ) : (
    <span className="doc-search-badge history">
      History Available
    </span>
  )}
</div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default PatientSearch;
