import { useState } from "react";
import { prescriptions } from "../data/prescriptions";
import Button from "../../../components/common/Button";
import "../../../styles/doctor_dashboard.css";

function PrescriptionSection() {
  const [medicineList, setMedicineList] = useState(prescriptions);

  const removeMedicine = (medicineId) => {
    setMedicineList((currentList) => currentList.filter((medicine) => medicine.id !== medicineId));
  };

  return (
    <section className="doc-prescription-section">
      <div className="doc-prescription-heading">
        <span className="material-symbols-outlined filled">auto_awesome</span>
        <h3>Prescription Section</h3>
      </div>

      <div className="doc-medicine-list">
        {medicineList.map((medicine) => (
          <article className="doc-medicine-card" key={medicine.id}>
            <div>
              <div className="doc-medicine-name">
                <strong>{medicine.name}</strong>
                {medicine.suggested && <span>Suggested</span>}
              </div>
              <p>{medicine.directions}</p>
            </div>
            <div className="doc-medicine-actions">
              <Button className="doc-small-action" aria-label={`Edit ${medicine.name}`}>
                <span className="material-symbols-outlined">edit</span>
              </Button>
              <Button className="doc-small-action delete" aria-label={`Delete ${medicine.name}`} onClick={() => removeMedicine(medicine.id)}>
                <span className="material-symbols-outlined">delete</span>
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Button className="doc-manual-entry">
        <span className="material-symbols-outlined">add</span>
        Add Manual Entry
      </Button>

      <div className="doc-follow-up">
        <h4>Follow-up Consultation</h4>
        <label className="doc-follow-up-field">
          <span>Clinical Follow-up Notes</span>
          <textarea placeholder="Enter specific follow-up instructions, dietary advice, or lifestyle changes..." />
        </label>
        <label className="doc-follow-up-field doc-date-field">
          <span>Follow-up Date</span>
          <div>
            <input placeholder="Select date..." aria-label="Follow-up date" type="date"/>
          </div>
        </label>
      </div>
    </section>
  );
}

export default PrescriptionSection;
