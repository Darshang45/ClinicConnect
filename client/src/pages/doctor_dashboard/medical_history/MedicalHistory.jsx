import { useEffect, useState } from "react";
import { getPatientHistory } from "../../../services/doctorService";
import "../../../styles/doctor_dashboard.css";

function MedicalHistory({ patientId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const loadHistory = async () => {
      try {
        setLoading(true);

        const response = await getPatientHistory(patientId);

        setHistory(response.history || []);
      } catch (error) {
        console.error("Failed to load patient history", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [patientId]);

  return (
    <section className="doc-history-section">
      <h3 className="doc-subsection-title">
        Medical History
      </h3>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No medical history found.</p>
      ) : (
        <div className="doc-history-timeline">
          {history.map((visit) => (
            <article
              className="doc-history-item"
              key={visit.appointmentId}
            >
              <span className="doc-history-dot" />

              <time>{visit.appointmentDate}</time>

              <strong>{visit.reason}</strong>

              <p>
                <strong>Doctor:</strong> {visit.doctor}
              </p>

              <p>
                <strong>Department:</strong> {visit.department}
              </p>

              <p>
                <strong>Consultation:</strong>{" "}
                {visit.consultationType}
              </p>

              {visit.followUpDate && (
                <p>
                  <strong>Follow Up:</strong>{" "}
                  {visit.followUpDate}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MedicalHistory;