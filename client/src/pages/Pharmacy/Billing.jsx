import { useMemo, useState } from "react";
import {
  FiCheckSquare,
  FiChevronDown,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiMinus,
  FiPlus,
  FiPrinter,
  FiSearch,
  FiShield,
  FiX,
} from "react-icons/fi";

function Modal({ title, children, onClose }) {
  return <div className="ph-modal-backdrop" role="presentation" onMouseDown={onClose}><section className="ph-modal ph-invoice-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><header className="ph-modal-header"><h2>{title}</h2><button className="ph-icon-button" type="button" aria-label={`Close ${title}`} onClick={onClose}><FiX /></button></header>{children}</section></div>;
}

function PharmacyBilling({ prescriptions, selectedPrescription, onSelectPrescription, onDownloadPdf, onPrint, onToast }) {
  const [lookup, setLookup] = useState("");
  const [quantities, setQuantities] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [sendCopy, setSendCopy] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const quantityKey = (item) => `${selectedPrescription?.id || ""}:${item.name}`;
  const invoiceItems = useMemo(() => selectedPrescription?.items.map((item) => ({ ...item, quantity: quantities[quantityKey(item)] ?? item.quantity })) || [], [selectedPrescription, quantities]);
  const subtotal = invoiceItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const fee = selectedPrescription ? 5 : 0;
  const total = subtotal + tax + fee;

  const searchPrescription = () => {
    const result = prescriptions.find((item) => item.id.toLowerCase() === lookup.trim().toLowerCase());
    if (!result) {
      setError("No prescription matched that RX ID.");
      return;
    }
    setError("");
    onSelectPrescription(result);
  };

  const changeQuantity = (item, amount) => setQuantities((current) => ({ ...current, [quantityKey(item)]: Math.max(1, (current[quantityKey(item)] ?? item.quantity) + amount) }));
  const updateQuantity = (item, value) => setQuantities((current) => ({ ...current, [quantityKey(item)]: Math.max(1, Number(value) || 1) }));
  const invoiceLines = () => [
    "ClinicConnect Pharmacy Invoice",
    `Prescription: ${selectedPrescription.id}`,
    `Patient: ${selectedPrescription.patient}`,
    `Payment method: ${paymentMethod}`,
    ...invoiceItems.map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`),
    `Subtotal: $${subtotal.toFixed(2)}`,
    `Tax: $${tax.toFixed(2)}`,
    `Pharmacy fee: $${fee.toFixed(2)}`,
    `Total: $${total.toFixed(2)}`,
  ];
  const generateInvoice = () => {
    if (!selectedPrescription) {
      setError("Find a prescription before generating an invoice.");
      return;
    }
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setPreviewOpen(true);
      onToast(`Invoice for ${selectedPrescription.id} generated.`, "success");
    }, 400);
  };

  return (
    <section className="ph-section" id="MedicineBilling">
      <div className="ph-section-heading"><div><h2>Billing Console</h2><p>Point-of-sale interface for medication fulfillment and payment.</p></div></div>
      <div className="ph-billing-grid">
        <div className="ph-billing-controls">
          <div className="ph-billing-step"><label>01. Prescription Identification</label><div className="ph-rx-lookup"><input value={lookup} onChange={(event) => setLookup(event.target.value)} onKeyDown={(event) => event.key === "Enter" && searchPrescription()} placeholder="Scan barcode or enter RX ID (e.g., RX-88421)" /><button className="ph-secondary-button" type="button" onClick={searchPrescription}><FiSearch />Search</button></div>{error && <p className="ph-form-error">{error}</p>}</div>
          <div className="ph-billing-step"><label>02. Itemized Medication Review</label>{selectedPrescription ? <div className="ph-billing-table-wrap"><table className="ph-billing-table"><thead><tr><th>Medicine Name</th><th>Dosage</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>{invoiceItems.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.dosage}</td><td><div className="ph-quantity-control"><button type="button" aria-label={`Decrease ${item.name}`} disabled={item.quantity <= 1} onClick={() => changeQuantity(item, -1)}><FiMinus /></button><input type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item, event.target.value)} /><button type="button" aria-label={`Increase ${item.name}`} onClick={() => changeQuantity(item, 1)}><FiPlus /></button></div></td><td>${item.price.toFixed(2)}</td><td><strong>${(item.price * item.quantity).toFixed(2)}</strong></td></tr>)}</tbody></table></div> : <div className="ph-billing-empty"><FiFileText /><p>Search an RX ID to review medicine items.</p></div>}</div>
          <div className="ph-billing-step"><label>03. Transaction Method</label><div className="ph-payment-methods">{[["Cash", FiCheckSquare], ["Card", FiCreditCard], ["Insurance", FiShield]].map(([name, Icon]) => <button className={paymentMethod === name ? "is-active" : ""} type="button" key={name} onClick={() => setPaymentMethod(name)}><Icon /><span>{name}</span></button>)}</div></div>
        </div>
        <aside className="ph-order-summary"><h3>Order Summary</h3>{selectedPrescription ? <><div className="ph-summary-pair"><span>Patient Name</span><strong>{selectedPrescription.patient}</strong></div><div className="ph-summary-pair"><span>Prescription #</span><strong>{selectedPrescription.id}</strong></div><div className="ph-summary-totals"><div><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div><div><span>Pharmacy Fee</span><span>${fee.toFixed(2)}</span></div><div className="ph-total"><span>Total Amount</span><strong>${total.toFixed(2)}</strong></div></div><label className="ph-checkbox"><input type="checkbox" checked={sendCopy} onChange={(event) => setSendCopy(event.target.checked)} />Send copy to patient portal</label><div className="ph-summary-actions"><button className="ph-primary-button" disabled={isGenerating} type="button" onClick={generateInvoice}><FiFileText />{isGenerating ? "Generating..." : "Generate Invoice"}</button><button className="ph-secondary-button" type="button" onClick={() => setPreviewOpen(true)}><FiChevronDown />Preview</button><button className="ph-secondary-button" type="button" onClick={() => onPrint([invoiceLines()], `Invoice ${selectedPrescription.id}`)}><FiPrinter />Print</button><button className="ph-secondary-button" type="button" onClick={() => onDownloadPdf(`invoice-${selectedPrescription.id}.pdf`, invoiceLines())}><FiDownload />Download PDF</button></div></> : <div className="ph-billing-empty"><FiFileText /><p>Invoice totals appear after selecting a prescription.</p></div>}</aside>
      </div>
      {previewOpen && selectedPrescription && <Modal title={`Invoice Preview · ${selectedPrescription.id}`} onClose={() => setPreviewOpen(false)}><div className="ph-modal-body ph-invoice-preview"><div className="ph-summary-pair"><span>Patient</span><strong>{selectedPrescription.patient}</strong></div><div className="ph-summary-pair"><span>Payment method</span><strong>{paymentMethod}</strong></div>{invoiceItems.map((item) => <div className="ph-summary-pair" key={item.name}><span>{item.name} × {item.quantity}</span><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}<div className="ph-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><p className="ph-preview-note">{sendCopy ? "A copy will be sent to the patient portal." : "Patient portal copy disabled."}</p><div className="ph-modal-actions"><button className="ph-secondary-button" type="button" onClick={() => onPrint([invoiceLines()], `Invoice ${selectedPrescription.id}`)}><FiPrinter />Print</button><button className="ph-primary-button" type="button" onClick={() => onDownloadPdf(`invoice-${selectedPrescription.id}.pdf`, invoiceLines())}><FiDownload />Download PDF</button></div></div></Modal>}
    </section>
  );
}

export default PharmacyBilling;
