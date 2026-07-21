import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiFileText,
  FiFilter,
  FiMail,
  FiAlertCircle,
  FiCheckCircle,
  FiDroplet,
  FiMoreVertical,
  FiPause,
  FiPlay,
  FiPrinter,
  FiRotateCcw,
  FiSearch,
  FiShoppingBag,
  FiSliders,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const tabs = ["All", "Pending", "Held", "Dispensed"];

const detailTabs = ["Prescription", "Patient Profile", "Medical Reports", "Previous Prescriptions", "Allergies", "Doctor Notes", "History"];

const rowActions = [
  { label: "Verify", icon: FiCheckCircle },
  { label: "Dispense", icon: FiShoppingBag },
  { label: "Partial Dispense", icon: FiDroplet },
  { label: "Hold", icon: FiPause },
  { label: "Resume", icon: FiPlay },
  { label: "Cancel", icon: FiXCircle },
  { label: "Generate Invoice", icon: FiFileText },
  { label: "Download", icon: FiDownload },
  { label: "Contact Doctor", icon: FiMail },
];

function Modal({ title, children, onClose }) {
  return (
    <div className="ph-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="ph-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="ph-modal-header"><h2>{title}</h2><button className="ph-icon-button" type="button" aria-label={`Close ${title}`} onClick={onClose}><FiX /></button></header>
        {children}
      </section>
    </div>
  );
}

function PharmacyPrescription({ prescriptions, globalSearch, onClearGlobalSearch, onAction, onBulkAction, onLoadToBilling, onDownloadPdf, onPrint, onToast, busyAction }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ patient: "", doctor: "", department: "", status: "", priority: "", from: "", to: "" });
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("Preparing");
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("pharmacy-queue-tab") || "All");
  const [menuId, setMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [detailPrescription, setDetailPrescription] = useState(null);
  const [detailTab, setDetailTab] = useState(() => localStorage.getItem("pharmacy-detail-tab") || "Prescription");
  const [doctorMessage, setDoctorMessage] = useState(null);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("pharmacy-queue-tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("pharmacy-detail-tab", detailTab);
  }, [detailTab]);

  useEffect(() => {
    if (!menuId) return;
    const handleEscape = (event) => { if (event.key === "Escape") { setMenuId(null); setMenuPos(null); } };
    const handleClose = () => { setMenuId(null); setMenuPos(null); };
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [menuId]);

  const patients = useMemo(() => [...new Set(prescriptions.map((item) => item.patient))], [prescriptions]);
  const doctors = useMemo(() => [...new Set(prescriptions.map((item) => item.physician))], [prescriptions]);
  const departments = useMemo(() => [...new Set(prescriptions.map((item) => item.department))], [prescriptions]);

  const filteredRows = useMemo(() => {
    const searchTerms = `${debouncedQuery} ${globalSearch}`.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return prescriptions.filter((item) => {
      const searchValue = `${item.id} ${item.patient} ${item.patientId} ${item.physician} ${item.department} ${item.status}`.toLowerCase();
      const matchesSearch = searchTerms.every((term) => searchValue.includes(term));
      const matchesTab = activeTab === "All" || (activeTab === "Held" ? item.status === "On Hold" : item.status === activeTab);
      const matchesFilters = (!filters.patient || item.patient === filters.patient)
        && (!filters.doctor || item.physician === filters.doctor)
        && (!filters.department || item.department === filters.department)
        && (!filters.status || item.status === filters.status)
        && (!filters.priority || item.priority === filters.priority)
        && (!filters.from || item.date >= filters.from)
        && (!filters.to || item.date <= filters.to);
      return matchesSearch && matchesTab && matchesFilters;
    });
  }, [activeTab, debouncedQuery, filters, globalSearch, prescriptions]);

  const sortedRows = useMemo(() => [...filteredRows].sort((first, second) => {
    const left = String(first[sort.field] || "").toLowerCase();
    const right = String(second[sort.field] || "").toLowerCase();
    if (left === right) return 0;
    const result = left > right ? 1 : -1;
    return sort.direction === "asc" ? result : -result;
  }), [filteredRows, sort]);

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selectedRows = prescriptions.filter((item) => selectedIds.includes(item.id));
  const allPageSelected = pageRows.length > 0 && pageRows.every((item) => selectedIds.includes(item.id));

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const resetFilters = () => {
    setFilters({ patient: "", doctor: "", department: "", status: "", priority: "", from: "", to: "" });
    setQuery("");
    onClearGlobalSearch();
    setFiltersOpen(false);
  };

  const toggleSort = (field) => setSort((current) => ({ field, direction: current.field === field && current.direction === "asc" ? "desc" : "asc" }));
  const toggleRow = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleAll = () => setSelectedIds((current) => allPageSelected ? current.filter((id) => !pageRows.some((item) => item.id === id)) : [...new Set([...current, ...pageRows.map((item) => item.id)])]);

  const runBulk = (type) => {
    if (!selectedRows.length) {
      onToast("Select at least one prescription first.", "error");
      return;
    }
    if (type === "print") onPrint(selectedRows, "Prescription batch");
    if (type === "invoice") onBulkAction(selectedRows.map((item) => item.id), "Generate Invoice");
    if (type === "status") onBulkAction(selectedRows.map((item) => item.id), bulkStatus);
    setSelectedIds([]);
  };

  const runAction = (item, action) => {
    setMenuId(null);
    setMenuPos(null);
    if (action === "View") {
      setDetailPrescription(item);
      return;
    }
    if (action === "Generate Invoice") {
      onLoadToBilling(item);
      return;
    }
    if (action === "Print") {
      onPrint([item], `Prescription ${item.id}`);
      return;
    }
    if (action === "Download") {
      onDownloadPdf(`${item.id}-prescription.pdf`, [`Prescription ${item.id}`, `Patient: ${item.patient}`, `Prescriber: ${item.physician}`, `Status: ${item.status}`]);
      return;
    }
    if (action === "Contact Doctor") {
      setDoctorMessage(item);
      setMessageBody(`Regarding ${item.id}, `);
      return;
    }
    onAction(item.id, action);
  };

  const sendDoctorMessage = () => {
    if (!messageBody.trim()) {
      onToast("Write a message before sending.", "error");
      return;
    }
    onToast(`Secure message sent to ${doctorMessage.physician}.`, "success");
    setDoctorMessage(null);
  };

  const statusClass = (status) => status.toLowerCase().replaceAll(" ", "-");

  const closeMenu = () => { setMenuId(null); setMenuPos(null); };

  const openMenu = (event, item) => {
    if (menuId === item.id) { closeMenu(); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < menuHeight ? rect.top - menuHeight - 6 : rect.bottom + 6;
    const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 10);
    setMenuId(item.id);
    setMenuPos({ top: Math.max(10, top), left: Math.max(10, left) });
  };

  const activeMenuItem = menuId ? prescriptions.find((p) => p.id === menuId) : null;

  return (
    <section className="ph-section" id="Prescriptions">
      <div className="ph-section-heading"><div><h2>Prescription Queue</h2><p>Monitor and process active medication orders.</p></div><div className="ph-queue-toolbar"><button className="ph-secondary-button" type="button" onClick={() => setFiltersOpen((open) => !open)}><FiFilter />Filter</button><button className="ph-primary-button" type="button" onClick={() => setDetailPrescription({ isNew: true, id: "", patient: "", physician: "", department: "General Medicine", priority: "Normal", items: [] })}><FiShoppingBag />New Order</button></div></div>
      <div className="ph-search-row"><label className="ph-search-input"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && setDebouncedQuery(query.trim().toLowerCase())} placeholder="Search patient, RX ID, or physician" /><button type="button" aria-label="Clear prescription search" onClick={() => setQuery("")} disabled={!query}><FiX /></button></label>{globalSearch && <button className="ph-text-button" type="button" onClick={onClearGlobalSearch}>Clear global search</button>}</div>
      {filtersOpen && <div className="ph-filter-panel"><div className="ph-filter-grid"><label>Patient<select value={filters.patient} onChange={(event) => updateFilter("patient", event.target.value)}><option value="">All patients</option>{patients.map((patient) => <option key={patient}>{patient}</option>)}</select></label><label>Doctor<select value={filters.doctor} onChange={(event) => updateFilter("doctor", event.target.value)}><option value="">All doctors</option>{doctors.map((doctor) => <option key={doctor}>{doctor}</option>)}</select></label><label>Department<select value={filters.department} onChange={(event) => updateFilter("department", event.target.value)}><option value="">All departments</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label><label>Status<select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}><option value="">All statuses</option>{[...new Set(prescriptions.map((item) => item.status))].map((status) => <option key={status}>{status}</option>)}</select></label><label>Priority<select value={filters.priority} onChange={(event) => updateFilter("priority", event.target.value)}><option value="">All priorities</option><option>Urgent</option><option>Normal</option></select></label><label>From<input type="date" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} /></label><label>To<input type="date" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} /></label></div><button className="ph-text-button" type="button" onClick={resetFilters}><FiRotateCcw />Reset filters</button></div>}
      <div className="ph-tabs" role="tablist">{tabs.map((tab) => <button className={activeTab === tab ? "is-active" : ""} role="tab" aria-selected={activeTab === tab} type="button" key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
      <div className="ph-bulk-bar"><span>{selectedRows.length ? `${selectedRows.length} selected` : `${filteredRows.length} results`}</span><div><button className="ph-text-button" type="button" onClick={() => runBulk("print")}><FiPrinter />Bulk print</button><button className="ph-text-button" type="button" onClick={() => runBulk("invoice")}><FiFileText />Bulk invoice</button><button className="ph-text-button" type="button" onClick={() => runBulk("status")}><FiCheck />Update status</button></div></div>
      <div className="ph-table-wrap"><table className="ph-table"><thead><tr><th><input type="checkbox" checked={allPageSelected} onChange={toggleAll} aria-label="Select all visible prescriptions" /></th>{[["id", "RX ID"], ["patient", "Patient"], ["physician", "Physician"], ["priority", "Priority"], ["createdAt", "Created At"], ["status", "Status"]].map(([field, label]) => <th key={field}><button type="button" onClick={() => toggleSort(field)}>{label}<FiSliders /></button></th>)}<th>Actions</th></tr></thead><tbody>{pageRows.map((item) => <tr key={item.id}><td><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleRow(item.id)} aria-label={`Select ${item.id}`} /></td><td><button className="ph-rx-link" type="button" onClick={() => runAction(item, "View")}>#{item.id}</button></td><td><strong>{item.patient}</strong><small>{item.patientId}</small></td><td>{item.physician}</td><td><span className={`ph-priority ${item.priority.toLowerCase()}`}>{item.priority}</span></td><td>{item.createdAt}</td><td><span className={`ph-status ${statusClass(item.status)}`}>{item.status}</span></td><td><div className="ph-row-actions"><button className="ph-icon-button" type="button" aria-label={`View ${item.id}`} onClick={() => runAction(item, "View")}><FiEye /></button><button className="ph-icon-button" type="button" aria-label={`Print ${item.id}`} onClick={() => runAction(item, "Print")}><FiPrinter /></button><button className={`ph-icon-button ${menuId === item.id ? "is-active" : ""}`} type="button" aria-label={`More actions for ${item.id}`} onClick={(event) => openMenu(event, item)}><FiMoreVertical /></button></div></td></tr>)}</tbody></table>{!pageRows.length && <div className="ph-empty-state"><FiSearch /><h3>No prescriptions found</h3><p>Try clearing a filter or changing your search.</p><button className="ph-secondary-button" type="button" onClick={resetFilters}>Reset filters</button></div>}</div>
      {activeMenuItem && menuPos && (<><div className="ph-menu-backdrop" onClick={closeMenu} /><div className="ph-floating-menu" role="menu" aria-label={`Actions for ${activeMenuItem.id}`} style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}><header className="ph-floating-menu-header"><strong>{activeMenuItem.id}</strong><span>{activeMenuItem.patient}</span></header>{rowActions.map(({ label, icon: Icon }) => <button className="ph-floating-menu-item" disabled={Boolean(busyAction)} type="button" key={label} onClick={() => runAction(activeMenuItem, label)}><Icon />{label}</button>)}</div></>)}
      <div className="ph-pagination"><span>Showing {pageRows.length ? (safePage - 1) * pageSize + 1 : 0} to {(safePage - 1) * pageSize + pageRows.length} of {filteredRows.length} entries</span><div><button type="button" aria-label="Previous page" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><FiChevronLeft /></button>{Array.from({ length: totalPages }, (_, index) => <button type="button" className={safePage === index + 1 ? "is-active" : ""} key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button type="button" aria-label="Next page" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><FiChevronRight /></button></div></div>
      {detailPrescription && <PrescriptionModal prescription={detailPrescription} detailTab={detailTab} setDetailTab={setDetailTab} onClose={() => setDetailPrescription(null)} onAction={runAction} onLoadToBilling={onLoadToBilling} onDownloadPdf={onDownloadPdf} onPrint={onPrint} busyAction={busyAction} />}
      {doctorMessage && <Modal title={`Contact ${doctorMessage.physician}`} onClose={() => setDoctorMessage(null)}><div className="ph-modal-body"><label>Secure message<textarea value={messageBody} onChange={(event) => setMessageBody(event.target.value)} rows="5" /></label><div className="ph-modal-actions"><button className="ph-secondary-button" type="button" onClick={() => setDoctorMessage(null)}>Cancel</button><button className="ph-primary-button" type="button" onClick={sendDoctorMessage}><FiMail />Send message</button></div></div></Modal>}
    </section>
  );
}

function PrescriptionModal({ prescription, detailTab, setDetailTab, onClose, onAction, onLoadToBilling, onDownloadPdf, onPrint, busyAction }) {
  const isNew = prescription.isNew;
  const [newOrder, setNewOrder] = useState({ patient: prescription.patient, physician: prescription.physician, department: prescription.department, priority: prescription.priority });
  const [error, setError] = useState("");

  const createOrder = () => {
    if (!newOrder.patient.trim() || !newOrder.physician.trim()) {
      setError("Patient and physician are required.");
      return;
    }
    onAction("new", "Create Order", newOrder);
    onClose();
  };

  if (isNew) return <Modal title="New Prescription Order" onClose={onClose}><div className="ph-modal-body"><div className="ph-form-grid"><label>Patient<input value={newOrder.patient} onChange={(event) => setNewOrder((current) => ({ ...current, patient: event.target.value }))} /></label><label>Physician<input value={newOrder.physician} onChange={(event) => setNewOrder((current) => ({ ...current, physician: event.target.value }))} /></label><label>Department<input value={newOrder.department} onChange={(event) => setNewOrder((current) => ({ ...current, department: event.target.value }))} /></label><label>Priority<select value={newOrder.priority} onChange={(event) => setNewOrder((current) => ({ ...current, priority: event.target.value }))}><option>Normal</option><option>Urgent</option></select></label></div>{error && <p className="ph-form-error"><FiAlertTriangle />{error}</p>}<div className="ph-modal-actions"><button className="ph-secondary-button" type="button" onClick={onClose}>Cancel</button><button className="ph-primary-button" type="button" onClick={createOrder}>Create order</button></div></div></Modal>;

  const patientContent = {
    "Patient Profile": <dl className="ph-detail-list"><div><dt>Patient ID</dt><dd>{prescription.patientId}</dd></div><div><dt>Age</dt><dd>42 years</dd></div><div><dt>Blood group</dt><dd>O+</dd></div><div><dt>Emergency contact</dt><dd>Available in profile</dd></div></dl>,
    "Medical Reports": <div className="ph-record-list"><p><FiFileText />Annual lipid profile · Ready</p><p><FiFileText />Blood pressure trend · Reviewed</p></div>,
    "Previous Prescriptions": <div className="ph-record-list"><p>RX-88019 · Completed · Sep 2024</p><p>RX-87201 · Completed · Aug 2024</p></div>,
    Allergies: <div className="ph-alert-box"><FiAlertTriangle /><div><strong>{prescription.allergies || "No known allergies"}</strong><span>Confirm before dispensing.</span></div></div>,
    "Doctor Notes": <div className="ph-note-box">{prescription.notes || "No additional prescribing notes."}</div>,
    History: <div className="ph-record-list"><p>Created {prescription.createdAt}</p><p>Current status: {prescription.status}</p><p>Last update: Pharmacy queue synchronization</p></div>,
  };

  return <Modal title={`Prescription ${prescription.id}`} onClose={onClose}><div className="ph-modal-body"><div className="ph-detail-tabs">{detailTabs.map((tab) => <button className={detailTab === tab ? "is-active" : ""} type="button" key={tab} onClick={() => setDetailTab(tab)}>{tab}</button>)}</div>{detailTab === "Prescription" ? <><dl className="ph-detail-list"><div><dt>Patient</dt><dd>{prescription.patient}</dd></div><div><dt>Prescribing doctor</dt><dd>{prescription.physician}</dd></div><div><dt>Department</dt><dd>{prescription.department}</dd></div><div><dt>Priority</dt><dd>{prescription.priority}</dd></div><div><dt>Status</dt><dd>{prescription.status}</dd></div></dl><div className="ph-item-list">{prescription.items.map((item) => <div key={item.name}><span><strong>{item.name}</strong><small>{item.dosage}</small></span><b>{item.quantity} units</b></div>)}</div><div className="ph-modal-actions ph-wrap-actions"><button className="ph-secondary-button" type="button" onClick={() => onPrint([prescription], `Prescription ${prescription.id}`)}><FiPrinter />Print</button><button className="ph-secondary-button" type="button" onClick={() => onDownloadPdf(`${prescription.id}-prescription.pdf`, [`Prescription ${prescription.id}`, `Patient: ${prescription.patient}`])}><FiDownload />Download PDF</button><button className="ph-secondary-button" type="button" onClick={() => onLoadToBilling(prescription)}><FiFileText />Generate invoice</button><button className="ph-primary-button" disabled={Boolean(busyAction)} type="button" onClick={() => onAction(prescription, "Dispense")}><FiCheck />Dispense</button></div></> : patientContent[detailTab]}</div></Modal>;
}

export default PharmacyPrescription;
