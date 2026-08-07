import { useEffect, useState } from "react";
import { FiDownload, FiPackage } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { getPatientPrescriptions, downloadPrescriptionPDF } from "../../../services/patientService";
import "../../../styles/patient_dashboard.css";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await getPatientPrescriptions();
      if (res?.success) {
        setPrescriptions(res.prescriptions || res.data || []);
      } else {
        setPrescriptions([]);
      }
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (prescriptionId, patientId) => {
    try {
      setDownloadingId(prescriptionId);
      const blob = await downloadPrescriptionPDF(prescriptionId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Prescription_${patientId || prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="pd-detail-section" id="prescriptions">
      <div className="pd-section-heading">
        <h2>Active Prescriptions</h2>
      </div>
      {loading ? (
        <p style={{ color: "var(--on-surface-variant)", padding: "16px" }}>Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <p style={{ color: "var(--on-surface-variant)", padding: "16px" }}>No active prescriptions found.</p>
      ) : (
        <div className="pd-detail-grid pd-prescription-grid">
          {prescriptions.map((prescription) => {
            const pId = prescription.prescriptionId || prescription._id;
            const medicinesList = Array.isArray(prescription.medicines) ? prescription.medicines : [];
            const doctorName = prescription.doctor ? `Dr. ${prescription.doctor}` : "Doctor";
            const dateStr = prescription.createdAt
              ? new Date(prescription.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Issued";

            return (
              <Card className="pd-prescription-card" key={pId}>
                <div className="pd-prescription-title">
                  <span className="pd-detail-icon">
                    <FiPackage />
                  </span>
                  <div>
                    <h3>{prescription.diagnosis ? `Diagnosis: ${prescription.diagnosis}` : "Medical Prescription"}</h3>
                    <small>{doctorName} • {dateStr}</small>
                  </div>
                </div>

                <div className="pd-prescription-medicines">
                  {medicinesList.length > 0 ? (
                    medicinesList.map((med, idx) => (
                      <div
                        key={med.id || idx}
                        style={{
                          marginBottom: "10px",
                          paddingBottom: "8px",
                          borderBottom: idx < medicinesList.length - 1 ? "1px dashed var(--surface-container-high)" : "none",
                        }}
                      >
                        <strong style={{ fontSize: "0.95rem", color: "var(--on-surface)" }}>
                          {med.medicine}
                        </strong>
                        <dl style={{ margin: "4px 0 0 0" }}>
                          <div>
                            <dt>Dosage</dt>
                            <dd>{med.dosage || "-"}</dd>
                          </div>
                          <div>
                            <dt>Frequency</dt>
                            <dd>{med.frequency || "-"}</dd>
                          </div>
                          <div>
                            <dt>Duration</dt>
                            <dd>{med.duration || "-"}</dd>
                          </div>
                        </dl>
                        {med.instructions && (
                          <p style={{ marginTop: "4px", fontSize: "0.85rem", color: "var(--on-surface-variant)" }}>
                            Instructions: {med.instructions}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "0.85rem", color: "var(--on-surface-variant)" }}>No medicines listed.</p>
                  )}
                </div>

                {prescription.notes && (
                  <p style={{ fontSize: "0.85rem", color: "var(--on-surface-variant)", marginTop: "4px" }}>
                    <strong>Notes:</strong> {prescription.notes}
                  </p>
                )}

                <Button
                  className="pd-compact-button"
                  onClick={() => handleDownload(pId, prescription.patientId)}
                  disabled={downloadingId === pId}
                >
                  <FiDownload />
                  {downloadingId === pId ? "Downloading..." : "Download PDF"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Prescriptions;
