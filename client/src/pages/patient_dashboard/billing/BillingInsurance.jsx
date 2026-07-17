import { FiCreditCard, FiShield } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { billing } from "../data/billing";
import "../../../styles/patient_dashboard.css";

function BillingInsurance() { return <section className="pd-detail-section" id="billing"><div className="pd-section-heading"><h2>Billing &amp; Insurance</h2><a href="#billing">Billing history</a></div><div className="pd-billing-grid">{billing.map((bill) => <Card className="pd-bill-card" key={bill.id}><div className="pd-bill-heading"><span className="pd-detail-icon"><FiCreditCard /></span><div><h3>{bill.description}</h3><small>{bill.date}</small></div><strong>{bill.amount}</strong></div><dl><div><dt>Payment status</dt><dd className={bill.paymentStatus === "Paid" ? "pd-paid" : "pd-outstanding"}>{bill.paymentStatus}</dd></div><div><dt>Insurance provider</dt><dd>{bill.insuranceProvider}</dd></div><div><dt>Claim status</dt><dd>{bill.claimStatus}</dd></div></dl><Button className={bill.paymentStatus === "Paid" ? "pd-compact-button pd-insurance-button" : "pd-compact-button"}>{bill.paymentStatus === "Paid" ? <FiShield /> : <FiCreditCard />}{bill.paymentStatus === "Paid" ? "View claim" : "Pay now"}</Button></Card>)}</div></section>; }

export default BillingInsurance;
