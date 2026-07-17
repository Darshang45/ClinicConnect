import { FiDownload, FiPackage } from "react-icons/fi";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import { prescriptions } from "../data/prescriptions";
import "../../../styles/patient_dashboard.css";

function Prescriptions() { return <section className="pd-detail-section" id="prescriptions"><div className="pd-section-heading"><h2>Active Prescriptions</h2><a href="#prescriptions">Manage refills</a></div><div className="pd-detail-grid pd-prescription-grid">{prescriptions.map((prescription) => <Card className="pd-prescription-card" key={prescription.id}><div className="pd-prescription-title"><span className="pd-detail-icon"><FiPackage /></span><div><h3>{prescription.name}</h3><small>{prescription.refillStatus}</small></div></div><dl><div><dt>Dosage</dt><dd>{prescription.dosage}</dd></div><div><dt>Frequency</dt><dd>{prescription.frequency}</dd></div><div><dt>Duration</dt><dd>{prescription.duration}</dd></div></dl><p>{prescription.instructions}</p><Button className="pd-compact-button"><FiDownload />Download PDF</Button></Card>)}</div></section>; }

export default Prescriptions;
