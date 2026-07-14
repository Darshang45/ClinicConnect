import { currentPatient } from "../data/patients";
import { prescriptions } from "../data/prescriptions";
import "../../../styles/doctor_dashboard.css";

function PrescriptionPreview() {
  return (
    <section className="doc-prescription-preview-section">
      <h3 className="doc-subsection-title">Prescription Preview</h3>
      <div className="doc-prescription-preview">
        <div className="doc-preview-top-line" />
        <div className="doc-preview-header">
          <div>
            <strong>Clinic Connect</strong>
            <p>123 Wellness Blvd, Healthcare City</p>
          </div>
          <div>
            <strong>Dr. Julianne Moore</strong>
            <p>Reg No: 99281-CM</p>
          </div>
        </div>
        <div className="doc-preview-patient">
          <div><span>Patient Name</span><strong>{currentPatient.fullName}</strong></div>
          <div><span>Date</span><strong>October 24, 2023</strong></div>
        </div>
        <div className="doc-preview-medicines">
          <span>Rx</span>
          <ol>
            {prescriptions.map((medicine) => (
              <li key={medicine.id}>
                <strong>{medicine.name}</strong>
                <p>{medicine.preview}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="doc-preview-footer">
          <div className="doc-preview-signature">Moore</div>
          <div className="doc-preview-qr"><span className="material-symbols-outlined">qr_code_2</span><small>VERIFY: LH-RX-20231024-001</small></div>
        </div>
      </div>
    </section>
  );
}

export default PrescriptionPreview;
