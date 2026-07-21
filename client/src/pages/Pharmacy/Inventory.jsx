import { useMemo, useState } from "react";
import { FiBox, FiDownload, FiEdit3, FiPackage, FiPlus, FiSearch, FiX } from "react-icons/fi";

function Modal({ title, children, onClose }) {
  return <div className="ph-modal-backdrop" role="presentation" onMouseDown={onClose}><section className="ph-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><header className="ph-modal-header"><h2>{title}</h2><button className="ph-icon-button" type="button" aria-label={`Close ${title}`} onClick={onClose}><FiX /></button></header>{children}</section></div>;
}

function PharmacyInventory({ inventory, onUpdateInventory, onAddInventory, onExportInventory, onToast }) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [adjustment, setAdjustment] = useState(0);
  const [newMedicine, setNewMedicine] = useState({ name: "", category: "General", available: "", reserved: "0", expiry: "" });
  const [error, setError] = useState("");

  const filteredInventory = useMemo(() => inventory.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [inventory, search]);

  const saveAdjustment = () => {
    const amount = Number(adjustment);
    if (!Number.isFinite(amount) || amount === 0) {
      setError("Enter a stock adjustment other than zero.");
      return;
    }
    if (selectedItem.available + amount < 0) {
      setError("Stock cannot be reduced below zero.");
      return;
    }
    onUpdateInventory(selectedItem.id, { available: selectedItem.available + amount });
    onToast(`${selectedItem.name} stock updated.`, "success");
    setSelectedItem(null);
  };

  const createMedicine = () => {
    const available = Number(newMedicine.available);
    const reserved = Number(newMedicine.reserved);
    if (!newMedicine.name.trim() || !Number.isFinite(available) || available < 0 || !newMedicine.expiry) {
      setError("Medicine name, a valid stock quantity, and expiry date are required.");
      return;
    }
    onAddInventory({ ...newMedicine, available, reserved: Number.isFinite(reserved) ? reserved : 0 });
    setNewMedicine({ name: "", category: "General", available: "", reserved: "0", expiry: "" });
    setError("");
    setIsAdding(false);
  };

  const stockState = (item) => item.available <= item.lowStockAt ? "Low Stock" : item.expiringSoon ? "Expiring Soon" : "In Stock";

  return (
    <section className="ph-section" id="Inventory">
      <div className="ph-section-heading"><div><h2>Inventory</h2><p>Track available medicines, reservations, and expiry dates.</p></div><div className="ph-queue-toolbar"><button className="ph-secondary-button" type="button" onClick={() => onExportInventory(inventory)}><FiDownload />Export</button><button className="ph-primary-button" type="button" onClick={() => { setError(""); setIsAdding(true); }}><FiPlus />Add Medicine</button></div></div>
      <label className="ph-search-input ph-inventory-search"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory" /><button type="button" aria-label="Clear inventory search" disabled={!search} onClick={() => setSearch("")}><FiX /></button></label>
      <div className="ph-inventory-grid">{filteredInventory.map((item) => <article className={`ph-inventory-card ${stockState(item).toLowerCase().replaceAll(" ", "-")}`} key={item.id}><div className="ph-inventory-card-top"><span className="ph-inventory-icon"><FiPackage /></span><span className="ph-stock-pill">{stockState(item)}</span></div><div><h3>{item.name}</h3><p>Category: {item.category}</p></div><div className="ph-stock-numbers"><div><small>Available</small><strong>{item.available} units</strong></div><div><small>Reserved</small><strong>{item.reserved} units</strong></div></div><div className="ph-inventory-card-footer"><span>{item.expiringSoon ? `Expires in ${item.daysToExpiry} days` : `Expiry: ${item.expiry}`}</span><button type="button" onClick={() => { setSelectedItem(item); setAdjustment(0); setError(""); }}><FiEdit3 />{item.expiringSoon ? "Review" : "Manage"}</button></div></article>)}</div>
      {!filteredInventory.length && <div className="ph-empty-state"><FiBox /><h3>No medicine found</h3><p>Try a different medicine name or add an inventory item.</p><button className="ph-secondary-button" type="button" onClick={() => setIsAdding(true)}>Add Medicine</button></div>}
      {selectedItem && <Modal title={`Manage ${selectedItem.name}`} onClose={() => setSelectedItem(null)}><div className="ph-modal-body"><dl className="ph-detail-list"><div><dt>Available stock</dt><dd>{selectedItem.available} units</dd></div><div><dt>Reserved stock</dt><dd>{selectedItem.reserved} units</dd></div><div><dt>Expiry</dt><dd>{selectedItem.expiry}</dd></div></dl><label>Stock adjustment<input type="number" value={adjustment} onChange={(event) => setAdjustment(event.target.value)} placeholder="Use a negative number to reduce stock" /></label>{error && <p className="ph-form-error">{error}</p>}<div className="ph-modal-actions"><button className="ph-secondary-button" type="button" onClick={() => setSelectedItem(null)}>Cancel</button><button className="ph-primary-button" type="button" onClick={saveAdjustment}>Save stock</button></div></div></Modal>}
      {isAdding && <Modal title="Add Medicine" onClose={() => setIsAdding(false)}><div className="ph-modal-body"><div className="ph-form-grid"><label>Medicine name<input value={newMedicine.name} onChange={(event) => setNewMedicine((current) => ({ ...current, name: event.target.value }))} /></label><label>Category<input value={newMedicine.category} onChange={(event) => setNewMedicine((current) => ({ ...current, category: event.target.value }))} /></label><label>Available units<input type="number" min="0" value={newMedicine.available} onChange={(event) => setNewMedicine((current) => ({ ...current, available: event.target.value }))} /></label><label>Reserved units<input type="number" min="0" value={newMedicine.reserved} onChange={(event) => setNewMedicine((current) => ({ ...current, reserved: event.target.value }))} /></label><label>Expiry date<input type="month" value={newMedicine.expiry} onChange={(event) => setNewMedicine((current) => ({ ...current, expiry: event.target.value }))} /></label></div>{error && <p className="ph-form-error">{error}</p>}<div className="ph-modal-actions"><button className="ph-secondary-button" type="button" onClick={() => setIsAdding(false)}>Cancel</button><button className="ph-primary-button" type="button" onClick={createMedicine}>Add medicine</button></div></div></Modal>}
    </section>
  );
}

export default PharmacyInventory;
