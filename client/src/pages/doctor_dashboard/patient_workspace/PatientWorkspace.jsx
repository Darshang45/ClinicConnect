import { useEffect, useState } from "react";

import Card from "../../../components/common/Card";

import PatientProfile from "../patient_profile/PatientProfile";
import MedicalHistory from "../medical_history/MedicalHistory";
import DiagnosticReports from "../diagnostic_reports/DiagnosticReports";
import Consultation from "../consultation/Consultation";
import PrescriptionSection from "../prescription/PrescriptionSection";
import PrescriptionPreview from "../prescription_preview/PrescriptionPreview";
import PatientRecord from "../patient_record/PatientRecord";

import {
  startConsultation,
  updateConsultation,
  completeConsultation,
} from "../../../services/doctorService";

import "../../../styles/doctor_dashboard.css";
import ActionFooter from "../action_footer/ActionFooter";

function PatientWorkspace({
  appointment,
  patientRecord,
  onConsultationCompleted,
})  {
  const [loading, setLoading] = useState(false);

  const [consultation, setConsultation] = useState({
    symptoms: "",
    notes: "",
  });

  const [prescription, setPrescription] = useState({
    diagnosis: "",
    notes: "",
    followUpDate: "",
    medicines: [],
  });

  useEffect(() => {
    if (!appointment) return;

    setConsultation({
      symptoms: Array.isArray(appointment.symptoms)
        ? appointment.symptoms.join(", ")
        : appointment.symptoms || "",

      notes: appointment.notes || "",
    });

    setPrescription({
      diagnosis: "",
      notes: "",
      followUpDate: "",
      medicines: [],
    });
  }, [appointment]);

  const handleStartConsultation = async () => {
    try {
      setLoading(true);

      await startConsultation(appointment.appointmentId);

      alert("Consultation Started");

      // Refresh dashboard & selected appointment
      if (onConsultationCompleted) {
        await onConsultationCompleted(appointment.appointmentId);
      }
    } catch (error) {
      console.error(error);

      alert("Unable to start consultation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteConsultation = async () => {
    try {
      setLoading(true);

      await updateConsultation(appointment.appointmentId, {
        symptoms: consultation.symptoms
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        notes: consultation.notes,
      });

      await completeConsultation(appointment.appointmentId);

      alert("Consultation Completed");

      // Refresh dashboard & selected appointment
      if (onConsultationCompleted) {
        await onConsultationCompleted(appointment.appointmentId);
      }
    } catch (error) {
      console.error(error);

      alert("Unable to complete consultation.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
// Action Footer
// =====================================

const handleSaveDraft = async () => {
  try {
    setLoading(true);

    await updateConsultation(appointment.appointmentId, {
      symptoms: consultation.symptoms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      notes: consultation.notes,
    });

    alert("Consultation draft saved.");

  } catch (error) {

    console.error(error);

    alert("Unable to save draft.");

  } finally {

    setLoading(false);

  }
};

const handleUpdateReception = () => {

  // Notification API will be integrated
  // in Notification Phase

  alert("Reception notified.");

};

const handleCompleteAndSend = async () => {

  await handleCompleteConsultation();

};

// =====================================
// Patient Record
// =====================================

if (patientRecord) {
  return (
    <PatientRecord
      patient={patientRecord.patient}
      appointments={patientRecord.appointments}
      prescriptions={patientRecord.prescriptions}
    />
  );
}

// =====================================
// Empty Workspace
// =====================================

if (!appointment) {
  return (
    <Card className="doc-workspace">
      <div className="doc-workspace-header">
        <div>
          <span />
          <h2>Current Patient Workspace</h2>
        </div>
      </div>

      <div className="doc-workspace-content">
        <div className="doc-workspace-empty">
          <h3>Select a Patient</h3>

          <p>
            Choose a patient from Today's Queue
            to begin consultation.
          </p>
        </div>
      </div>
    </Card>
  );
}
    
  

    return (
    <Card className="doc-workspace">
      <div className="doc-workspace-header">
        <div>
          <span />
          <h2>Current Patient Workspace</h2>
        </div>
      </div>

      <div className="doc-workspace-content">
        <PatientProfile patient={appointment.patient} />

        <div className="doc-workspace-body">
          <aside className="doc-workspace-sidebar">
            <MedicalHistory patientId={appointment.patient._id} />
            <DiagnosticReports
  patient={appointment.patient}
  appointment={appointment}
/>
          </aside>

          <div className="doc-workspace-main">
            <Consultation
              appointment={appointment}
              consultation={consultation}
              onConsultationChange={setConsultation}
              onStartConsultation={handleStartConsultation}
              onCompleteConsultation={handleCompleteConsultation}
              loading={loading}
            />

            <PrescriptionSection
              appointment={appointment}
              onPrescriptionChange={setPrescription}
              onConsultationCompleted={onConsultationCompleted}
            />

            <div id="doc-print-area">
  <PrescriptionPreview
    appointment={appointment}
    prescription={prescription}
  />
</div>

<ActionFooter
  loading={loading}
  onUpdateReception={handleUpdateReception}
  onSaveDraft={handleSaveDraft}
  onCompleteAndSend={handleCompleteAndSend}
/>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PatientWorkspace;