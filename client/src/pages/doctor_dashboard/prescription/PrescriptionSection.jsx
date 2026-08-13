import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import { getMedicines } from "../../../services/medicineService";
import "../../../styles/doctor_dashboard.css";
import {
  createPrescription,
  getPrescriptionByAppointment,
  updatePrescription,
} from "../../../services/doctorService";
import Select from "react-select";



function PrescriptionSection({
  appointment,
  onPrescriptionChange,
  onConsultationCompleted,
}) {
  const [availableMedicines, setAvailableMedicines] = useState([]);

  const [medicineList, setMedicineList] = useState([]);

  const [diagnosis, setDiagnosis] = useState("");

  const [selectedMedicine, setSelectedMedicine] = useState("");

  const [dosage, setDosage] = useState("");

  const [frequency, setFrequency] = useState("");

  const [duration, setDuration] = useState("");

  const [quantity, setQuantity] = useState("");

  const [instructions, setInstructions] = useState("");

  const [notes, setNotes] = useState("");

  const [followUpDate, setFollowUpDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [existingPrescription, setExistingPrescription] = useState(null);

  const [loadingPrescription, setLoadingPrescription] = useState(false);

  const medicineOptions = availableMedicines.map((medicine) => ({
  value: medicine._id,
  label: `${medicine.name} (${medicine.strength})`,
}));

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    if (appointment) {
      loadExistingPrescription();
    }
  }, [appointment]);

  const loadMedicines = async () => {
    try {
      setLoading(true);

      const response = await getMedicines();

      setAvailableMedicines(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingPrescription = async () => {
    if (!appointment?.appointmentId) return;

    try {
      setLoadingPrescription(true);

      const response = await getPrescriptionByAppointment(
        appointment.appointmentId,
      );

      if (!response.success) return;

      const prescription = response.prescription;

      // No prescription yet — response.success is true but prescription is null
      if (!prescription) {
        setExistingPrescription(null);
        setMedicineList([]);
        setDiagnosis("");
        setNotes("");
        setFollowUpDate("");
        return;
      }

      const medicines = prescription.medicines || [];

      setExistingPrescription(prescription);

      const formattedMedicines = medicines.map((item) => ({
        medicine: item.medicine,
        medicineName: item.medicine?.name || "",
        genericName: item.medicine?.genericName || "",
        strength: item.medicine?.strength || "",
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions,
      }));

      setMedicineList(formattedMedicines);

      setDiagnosis(prescription.diagnosis || "");

      setNotes(prescription.notes || "");

      setFollowUpDate(
        prescription.followUpDate
          ? prescription.followUpDate.split("T")[0]
          : "",
      );

      onPrescriptionChange?.({
        diagnosis: prescription.diagnosis,
        notes: prescription.notes,
        followUpDate: prescription.followUpDate,
        medicines: formattedMedicines,
      });
    } catch (error) {
      // No prescription yet
      if (error.response?.status === 404) {
        setExistingPrescription(null);
        setMedicineList([]);
        setDiagnosis("");
        setNotes("");
        setFollowUpDate("");
        return;
      }

      console.error(error);
    } finally {
      setLoadingPrescription(false);
    }
  };

  const addMedicine = () => {
    if (!selectedMedicine || !dosage || !frequency || !duration || !quantity) {
      alert("Please fill all medicine details.");
      return;
    }

    const medicine = availableMedicines.find(
      (item) => item._id === selectedMedicine,
    );

    if (!medicine) return;

    const exists = medicineList.some((item) => item.medicine === medicine._id);

    if (exists) {
      alert("Medicine already added.");
      return;
    }

    const newMedicine = {
      medicine: medicine._id,
      medicineName: medicine.name,
      dosage,
      frequency,
      duration,
      quantity,
      instructions,
    };

    const updatedList = [...medicineList, newMedicine];

    setMedicineList(updatedList);

    onPrescriptionChange?.({
      diagnosis,
      notes,
      followUpDate,
      medicines: updatedList,
    });

    setSelectedMedicine("");
    setDosage("");
    setFrequency("");
    setDuration("");
    setQuantity("");
    setInstructions("");
  };

  const removeMedicine = (index) => {
    const updated = medicineList.filter((_, i) => i !== index);

    setMedicineList(updated);

    onPrescriptionChange?.({
      diagnosis,
      notes,
      followUpDate,
      medicines: updated,
    });
  };

  const savePrescription = async () => {
    try {
      setSaving(true);

      if (!diagnosis.trim()) {
  alert("Please enter the patient's diagnosis.");
  return;
}

if (medicineList.length === 0) {
  alert("Please prescribe at least one medicine.");
  return;
}

if (
  followUpDate &&
  new Date(followUpDate) < new Date().setHours(0, 0, 0, 0)
) {
  alert("Follow-up date cannot be in the past.");
  return;
}

      const payload = {
        appointment: appointment.appointmentId,

        patient: appointment.patient._id,

        doctor: appointment.doctor._id,

        diagnosis,

        notes,

        followUpDate,

        medicines: medicineList.map((medicine) => ({
          medicine: medicine.medicine,
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          duration: medicine.duration,
          quantity: medicine.quantity,
          instructions: medicine.instructions,
        })),
      };

      if (existingPrescription) {
        await updatePrescription(existingPrescription._id, payload);

        alert("Prescription updated successfully.");
      } else {
        await createPrescription(payload);

        alert("Prescription created successfully.");
      }

      // Reload prescription
      await loadExistingPrescription();

      onPrescriptionChange?.({
        diagnosis,
        notes,
        followUpDate,
        medicines: medicineList,
      });

      if (onConsultationCompleted) {
        await onConsultationCompleted(appointment.appointmentId);
      }
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to save prescription.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPrescription) {
    return (
      <section className="doc-prescription-section">
        <p>Loading prescription...</p>
      </section>
    );
  }

  return (
    <section className="doc-prescription-section">
      <div className="doc-prescription-heading">
        <span className="material-symbols-outlined filled">auto_awesome</span>
        <h3>Prescription Section</h3>
      </div>

      <div className="doc-prescription-form">
        <label className="doc-follow-up-field">
          <span>Diagnosis</span>

          <textarea
            value={diagnosis}
            onChange={(e) => {
              setDiagnosis(e.target.value);

              onPrescriptionChange?.({
                diagnosis: e.target.value,
                notes,
                followUpDate,
                medicines: medicineList,
              });
            }}
            placeholder="Enter diagnosis..."
          />
        </label>

        <label className="doc-follow-up-field">
  <span>Select Medicine</span>

  <Select
    options={medicineOptions}
    value={
      medicineOptions.find(
        (option) => option.value === selectedMedicine
      ) || null
    }
    onChange={(option) =>
      setSelectedMedicine(option?.value || "")
    }
    placeholder="Search medicine..."
    isSearchable
    isClearable
  />
</label>

        <div className="doc-vitals-grid">
          <label className="doc-vital-card">
            <span>Dosage</span>

            <input value={dosage} onChange={(e) => setDosage(e.target.value)} />
          </label>

          <label className="doc-vital-card">
            <span>Frequency</span>

            <input
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </label>

          <label className="doc-vital-card">
            <span>Duration</span>

            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </label>

          <label className="doc-vital-card">
            <span>Quantity</span>

            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
        </div>

        <label className="doc-follow-up-field">
          <span>Instructions</span>

          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>

        <Button className="doc-manual-entry" onClick={addMedicine}>
          <span className="material-symbols-outlined">add</span>
          Add Medicine
        </Button>
      </div>

      <div className="doc-medicine-list">
        {medicineList.length === 0 ? (
          <p>No medicines added.</p>
        ) : (
          medicineList.map((medicine, index) => (
            <article className="doc-medicine-card" key={medicine.medicine}>
              <div>
                <div className="doc-medicine-name">
                  <strong>{medicine.medicineName}</strong>
                </div>

                <p>
                  <strong>Dosage:</strong> {medicine.dosage}
                </p>

                <p>
                  <strong>Frequency:</strong> {medicine.frequency}
                </p>

                <p>
                  <strong>Duration:</strong> {medicine.duration}
                </p>

                <p>
                  <strong>Quantity:</strong> {medicine.quantity}
                </p>

                {medicine.instructions && (
                  <p>
                    <strong>Instructions:</strong> {medicine.instructions}
                  </p>
                )}
              </div>

              <div className="doc-medicine-actions">
                <Button
                  className="doc-small-action delete"
                  onClick={() => removeMedicine(index)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="doc-follow-up">
        <h4>Follow-up Consultation</h4>

        <label className="doc-follow-up-field">
          <span>Clinical Notes</span>

          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);

              onPrescriptionChange?.({
                diagnosis,
                notes: e.target.value,
                followUpDate,
                medicines: medicineList,
              });
            }}
            placeholder="Enter clinical notes..."
          />
        </label>

        <label className="doc-follow-up-field doc-date-field">
          <span>Follow-up Date</span>

          <div>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => {
                setFollowUpDate(e.target.value);

                onPrescriptionChange?.({
                  diagnosis,
                  notes,
                  followUpDate: e.target.value,
                  medicines: medicineList,
                });
              }}
            />
          </div>
        </label>
        <div className="doc-prescription-actions">
          <button
            type="button"
            className="doc-save-button"
            onClick={savePrescription}
            disabled={saving}
          >
            <span className="material-symbols-outlined">medication</span>

            {saving
              ? "Saving Prescription..."
              : existingPrescription
                ? "Update Prescription"
                : "Issue Prescription"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default PrescriptionSection;
