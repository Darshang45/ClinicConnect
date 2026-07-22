import { useState } from "react";
import { FiDownload, FiFileText, FiPrinter } from "react-icons/fi";
import Button from "../../../components/common/Button";
import BackButton from "../../../components/common/BackButton";
import Card from "../../../components/common/Card";
import { billing } from "../../patient_dashboard/data/billing";
import { prescriptions } from "../../patient_dashboard/data/prescriptions";
import appointments from "../data/appointments";
import patient from "../data/patient";
import "../../../styles/reception_dashboard.css";

const amountValue = (amount) => Number(amount.replace(/[^\d.-]/g, "")) || 0;

function ReceptionBilling({ appointment = appointments[0], selectedPatient = patient }) {
  const [isGenerated, setIsGenerated] = useState(false);
  const consultationCharge = billing.find(({ description }) => description.includes("consultation"));
  const additionalCharge = billing.find(({ description }) => !description.includes("consultation"));
  const total = billing.reduce((sum, charge) => sum + amountValue(charge.amount), 0);

  return (
    <main className="rc-dashboard-main">
      <section className="rc-registration-section rc-billing-section">
        <div className="rc-section-heading">
          <h2>Billing</h2>
        </div>
        <Card className="rc-registration-card">
          <dl className="rc-patient-facts">
            <div><span>Patient</span><strong>{selectedPatient.name}</strong></div>
            <div><span>Patient ID</span><strong>#{selectedPatient.id}</strong></div>
            <div><span>Appointment</span><strong>{appointment.reason}</strong></div>
            <div><span>Doctor</span><strong>{appointment.doctor}</strong></div>
            <div><span>Appointment Time</span><strong>{appointment.time}</strong></div>
            <div><span>Payment Status</span><strong>{isGenerated ? "Ready for payment" : consultationCharge.paymentStatus}</strong></div>
          </dl>

          <div className="rc-history">
            <span>Medicine Charges</span>
            {prescriptions.map((prescription) => (
              <div className="rc-report-item" key={prescription.id}>
                <FiFileText />
                <div><strong>{prescription.name}</strong><small>{prescription.dosage} {"\u00b7"} {prescription.duration}</small></div>
                <strong>Pharmacy invoice</strong>
              </div>
            ))}
          </div>

          <div className="rc-history">
            <span>Consultation Charges</span>
            <div className="rc-report-item">
              <FiFileText />
              <div><strong>{consultationCharge.description}</strong><small>{consultationCharge.date}</small></div>
              <strong>{consultationCharge.amount}</strong>
            </div>
          </div>

          <div className="rc-history">
            <span>Additional Charges</span>
            <div className="rc-report-item">
              <FiFileText />
              <div><strong>{additionalCharge.description}</strong><small>{additionalCharge.date}</small></div>
              <strong>{additionalCharge.amount}</strong>
            </div>
          </div>

          <div className="rc-patient-facts">
            <div><span>Total</span><strong>{"\u20b9"}{total.toLocaleString("en-IN")}</strong></div>
          </div>

          <div className="rc-patient-buttons rc-billing-actions">
            <Button className="rc-form-submit" onClick={() => setIsGenerated(true)}><FiFileText />Generate Bill</Button>
            <Button onClick={() => window.print()}><FiPrinter />Print</Button>
            <Button><FiDownload />Download PDF</Button>
          </div>
        </Card>
        <div className="rc-billing-back">
          <BackButton to="/reception/dashboard" />
        </div>
      </section>
    </main>
  );
}

export default ReceptionBilling;
