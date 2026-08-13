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

import { createPharmacyOrder, getPharmacyOrderByPrescription, } from "../../services/pharmacyService";

const tabs = ["All", "Pending", "Held", "Dispensed"];

const detailTabs = [
  "Prescription",
  "Patient Profile",
  "Medical Reports",
  "Previous Prescriptions",
  "Allergies",
  "Doctor Notes",
  "History",
];

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
    <div
      className="ph-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="ph-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ph-modal-header">
          <h2>{title}</h2>
          <button
            className="ph-icon-button"
            type="button"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            <FiX />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

const getPrescriptionId = (prescription) => {
  const rawId = prescription?._id || prescription?.id || "";
  return String(rawId).replace(/^#/, "").trim();
};

function PharmacyPrescription({
  prescriptions,
  globalSearch,
  onClearGlobalSearch,
  onAction,
  onBulkAction,
  onLoadToBilling,
  onDownloadPdf,
  onPrint,
  onToast,
  busyAction,
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    patient: "",
    doctor: "",
    department: "",
    status: "",
    priority: "",
    from: "",
    to: "",
  });
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("Preparing");
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("pharmacy-queue-tab") || "All",
  );
  const [menuId, setMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [detailPrescription, setDetailPrescription] = useState(null);
  const [detailTab, setDetailTab] = useState(
    () => localStorage.getItem("pharmacy-detail-tab") || "Prescription",
  );
  const [doctorMessage, setDoctorMessage] = useState(null);
  const [messageBody, setMessageBody] = useState("");

  const [creatingOrder, setCreatingOrder] = useState(false);
  const [quantityOverrides, setQuantityOverrides] = useState({});

  const [pharmacyOrder, setPharmacyOrder] =
  useState(null);

const [loadingOrder, setLoadingOrder] =
  useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedQuery(query.trim().toLowerCase()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeTab, filters]);

  useEffect(() => {
    localStorage.setItem("pharmacy-queue-tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("pharmacy-detail-tab", detailTab);
  }, [detailTab]);

  useEffect(() => {
    if (!menuId) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuId(null);
        setMenuPos(null);
      }
    };
    const handleClose = () => {
      setMenuId(null);
      setMenuPos(null);
    };
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [menuId]);

  const patients = useMemo(
    () => [...new Set(prescriptions.map((item) => item.patient))],
    [prescriptions],
  );
  const doctors = useMemo(
    () => [...new Set(prescriptions.map((item) => item.physician))],
    [prescriptions],
  );
  const departments = useMemo(
    () => [...new Set(prescriptions.map((item) => item.department))],
    [prescriptions],
  );

  const filteredRows = useMemo(() => {
    const searchTerms = debouncedQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return prescriptions.filter((item) => {
      // Search only the fields shown in the prescription table.
      // This prevents unrelated hidden fields from making a row match.
      const searchableText = [
        item.id,
        item._id,
        item.patient,
        item.patientName,
        item.patientId,
        item.physician,
        item.doctor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchTerms.every((term) =>
        searchableText.includes(term),
      );

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Pending"
          ? item.status === "Issued" || item.status === "Pending"
          : activeTab === "Held"
            ? item.status === "On Hold" || item.status === "Held"
            : activeTab === "Dispensed"
              ? item.status === "Dispensed"
              : true);

      const itemDate = item.date || item.createdAt;
      const normalizedItemDate = itemDate
        ? String(itemDate).slice(0, 10)
        : "";

      const matchesFilters =
        (!filters.patient || item.patient === filters.patient) &&
        (!filters.doctor ||
          item.physician === filters.doctor ||
          item.doctor === filters.doctor) &&
        (!filters.department || item.department === filters.department) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.priority || item.priority === filters.priority) &&
        (!filters.from || normalizedItemDate >= filters.from) &&
        (!filters.to || normalizedItemDate <= filters.to);

      return matchesSearch && matchesTab && matchesFilters;
    });
  }, [activeTab, debouncedQuery, filters, prescriptions]);

  const sortedRows = useMemo(
    () =>
      [...filteredRows].sort((first, second) => {
        const left = String(first[sort.field] || "").toLowerCase();
        const right = String(second[sort.field] || "").toLowerCase();
        if (left === right) return 0;
        const result = left > right ? 1 : -1;
        return sort.direction === "asc" ? result : -result;
      }),
    [filteredRows, sort],
  );

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const selectedRows = prescriptions.filter((item) =>
    selectedIds.includes(item.id),
  );
  const allPageSelected =
    pageRows.length > 0 &&
    pageRows.every((item) => selectedIds.includes(item.id));

  const updateFilter = (field, value) =>
    setFilters((current) => ({ ...current, [field]: value }));
  const resetFilters = () => {
    setFilters({
      patient: "",
      doctor: "",
      department: "",
      status: "",
      priority: "",
      from: "",
      to: "",
    });
    setQuery("");
    onClearGlobalSearch();
    setFiltersOpen(false);
  };

  const toggleSort = (field) =>
    setSort((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  const toggleRow = (id) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const toggleAll = () =>
    setSelectedIds((current) =>
      allPageSelected
        ? current.filter((id) => !pageRows.some((item) => item.id === id))
        : [...new Set([...current, ...pageRows.map((item) => item.id)])],
    );

  const runBulk = (type) => {
    if (!selectedRows.length) {
      onToast("Select at least one prescription first.", "error");
      return;
    }
    if (type === "print") printPrescriptionDocuments(selectedRows, "Prescription batch");
    if (type === "invoice")
      onBulkAction(
        selectedRows.map((item) => item.id),
        "Generate Invoice",
      );
    if (type === "status")
      onBulkAction(
        selectedRows.map((item) => item.id),
        bulkStatus,
      );
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
      printPrescriptionDocuments(
        [item],
        `Prescription ${getPrescriptionId(item) || item.id}`,
      );
      return;
    }
    if (action === "Download") {
      onDownloadPdf(`${item.id}-prescription.pdf`, [
        `Prescription ${item.id}`,
        `Patient: ${item.patient}`,
        `Prescriber: ${item.physician}`,
        `Status: ${item.status}`,
      ]);
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

  const statusClass = (status) => String(status || "").toLowerCase().replaceAll(" ", "-");

  const closeMenu = () => {
    setMenuId(null);
    setMenuPos(null);
  };

  const openMenu = (event, item) => {
    if (menuId === item.id) {
      closeMenu();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 380;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < menuHeight ? rect.top - menuHeight - 6 : rect.bottom + 6;
    const left = Math.min(
      rect.right - menuWidth,
      window.innerWidth - menuWidth - 10,
    );
    setMenuId(item.id);
    setMenuPos({ top: Math.max(10, top), left: Math.max(10, left) });
  };

  const activeMenuItem = menuId
    ? prescriptions.find((p) => p.id === menuId)
    : null;


    const updateItemQuantity = (item, amount) => {
  setQuantityOverrides((current) => {
    const currentQuantity =
      current[item.id] ?? item.quantity;

    return {
      ...current,
      [item.id]: Math.max(
        1,
        currentQuantity + amount
      ),
    };
  });
};

const getItemQuantity = (item) => {
  return quantityOverrides[item.id] ?? item.quantity ?? 1;
};

const getMedicineId = (item) => {
  const rawId =
    item?.medicineId ||
    item?.medicine?._id ||
    item?.medicine ||
    item?._id ||
    "";

  return String(rawId).replace(/^#/, "").trim();
};

const buildPrintLines = (prescription) => {
  const prescriptionId = getPrescriptionId(prescription) || "-";

  return [
    "ClinicConnect Prescription",
    "========================================",
    `Prescription ID: ${prescriptionId}`,
    `Patient: ${prescription?.patient || prescription?.patientName || "-"}`,
    `Patient ID: ${prescription?.patientId || "-"}`,
    `Doctor: ${prescription?.physician || prescription?.doctor || "-"}`,
    `Department: ${prescription?.department || "-"}`,
    `Priority: ${prescription?.priority || "-"}`,
    `Status: ${prescription?.status || "-"}`,
    `Diagnosis: ${prescription?.diagnosis || "-"}`,
    `Created: ${prescription?.createdAt || "-"}`,
    `Updated: ${prescription?.updatedAt || "-"}`,
    `Follow-up Date: ${prescription?.followUpDate || "-"}`,
    "",
    "MEDICINES",
    "========================================",
    ...(prescription?.items || []).flatMap((medicine) => [
      `Medicine: ${medicine?.name || "-"}`,
      `Generic Name: ${medicine?.genericName || "-"}`,
      `Strength: ${medicine?.strength || "-"}`,
      `Category: ${medicine?.category || "-"}`,
      `Dosage: ${medicine?.dosage || "-"}`,
      `Frequency: ${medicine?.frequency || "-"}`,
      `Duration: ${medicine?.duration || "-"}`,
      `Quantity: ${getItemQuantity(medicine)}`,
      `Instructions: ${medicine?.instructions || "-"}`,
      "",
    ]),
    "NOTES",
    "========================================",
    prescription?.notes || "No additional prescribing notes.",
  ];
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const printPrescriptionDocuments = (documents, title = "ClinicConnect Prescription") => {
  const lines = documents.flatMap((document) =>
    Array.isArray(document) ? document : buildPrintLines(document),
  );

  const popup = window.open("", "_blank", "width=900,height=700");

  if (!popup) {
    onToast("Allow popups to print the prescription.", "error");
    return;
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 18mm; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #191c1c;
      margin: 0;
      padding: 24px;
      background: #fff;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 18px;
      color: #006b2c;
    }
    pre {
      font: 14px/1.7 Arial, Helvetica, sans-serif;
      white-space: pre-wrap;
      margin: 0;
    }
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
      font-size: 11px;
      color: #666;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <pre>${escapeHtml(lines.join("\n"))}</pre>
  <div class="footer">ClinicConnect · Pharmacy Department</div>
</body>
</html>`;

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.focus();

  window.setTimeout(() => {
    popup.print();
  }, 300);
};


const handleCreatePharmacyOrder = async () => {
  if (!detailPrescription) {
    onToast(
      "Select a prescription first.",
      "error"
    );
    return;
  }

  try {
    setCreatingOrder(true);

    const prescriptionId = getPrescriptionId(detailPrescription);

    if (!prescriptionId) {
      onToast("Prescription ID is missing.", "error");
      return;
    }

    const items = (detailPrescription.items || [])
      .map((item) => ({
        medicine: getMedicineId(item),
        quantity: Number(getItemQuantity(item)),
      }))
      .filter(
        (item) =>
          item.medicine &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0,
      );

    if (!items.length) {
      onToast("No valid medicines selected.", "error");
      return;
    }

    await createPharmacyOrder(prescriptionId, items);

    onToast(
      `Pharmacy order created for ${prescriptionId}.`,
      "success",
    );

    setQuantityOverrides({});
    setDetailPrescription(null);

    setSelectedIds((current) =>
      current.filter(
        (id) =>
          id !== detailPrescription.id
      )
    );
  } catch (error) {
    console.error(
      "Failed to create pharmacy order:",
      error
    );

    onToast(
      error.response?.data?.message ||
        "Unable to create pharmacy order.",
      "error"
    );
  } finally {
    setCreatingOrder(false);
  }
};
const loadPharmacyOrder = async (prescriptionId) => {
  try {
    setLoadingOrder(true);
    setPharmacyOrder(null);

    const response =
      await getPharmacyOrderByPrescription(
        prescriptionId
      );

    setPharmacyOrder(
      response.order || null
    );
  } catch (error) {
    console.error(
      "Failed to load pharmacy order:",
      error
    );

    setPharmacyOrder(null);
  } finally {
    setLoadingOrder(false);
  }
};

  useEffect(() => {
    const prescriptionId = getPrescriptionId(detailPrescription);

    if (!detailPrescription || detailPrescription.isNew || !prescriptionId) {
      setPharmacyOrder(null);
      return;
    }

    loadPharmacyOrder(prescriptionId);
  }, [detailPrescription]);

  return (
    <section className="ph-section" id="Prescriptions">
      <div className="ph-section-heading">
        <div>
          <h2>Prescription Queue</h2>
          <p>Monitor and process active medication orders.</p>
        </div>
        <div className="ph-queue-toolbar">
          <button
            className="ph-secondary-button"
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <FiFilter />
            Filter
          </button>
         <button
  className="ph-primary-button"
  type="button"
  onClick={() => {
  if (selectedRows.length !== 1) {
    onToast(
      "Select exactly one prescription first.",
      "error"
    );
    return;
  }

  const prescription = selectedRows[0];

  setQuantityOverrides({});
  setDetailPrescription(prescription);
}}
>
  <FiShoppingBag />
  New Order
</button>
        </div>
      </div>
      <div className="ph-search-row">
        <label className="ph-search-input">
          <FiSearch />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" &&
              setDebouncedQuery(query.trim().toLowerCase())
            }
            placeholder="Search patient, RX ID, or physician"
          />
          <button
            type="button"
            aria-label="Clear prescription search"
            onClick={() => setQuery("")}
            disabled={!query}
          >
            <FiX />
          </button>
        </label>
        {globalSearch && (
          <button
            className="ph-text-button"
            type="button"
            onClick={onClearGlobalSearch}
          >
            Clear global search
          </button>
        )}
      </div>
      {filtersOpen && (
        <div className="ph-filter-panel">
          <div className="ph-filter-grid">
            <label>
              Patient
              <select
                value={filters.patient}
                onChange={(event) =>
                  updateFilter("patient", event.target.value)
                }
              >
                <option value="">All patients</option>
                {patients.map((patient) => (
                  <option key={patient}>{patient}</option>
                ))}
              </select>
            </label>
            <label>
              Doctor
              <select
                value={filters.doctor}
                onChange={(event) => updateFilter("doctor", event.target.value)}
              >
                <option value="">All doctors</option>
                {doctors.map((doctor) => (
                  <option key={doctor}>{doctor}</option>
                ))}
              </select>
            </label>
            <label>
              Department
              <select
                value={filters.department}
                onChange={(event) =>
                  updateFilter("department", event.target.value)
                }
              >
                <option value="">All departments</option>
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                <option value="">All statuses</option>
                {[...new Set(prescriptions.map((item) => item.status))].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Priority
              <select
                value={filters.priority}
                onChange={(event) =>
                  updateFilter("priority", event.target.value)
                }
              >
                <option value="">All priorities</option>
                <option>Urgent</option>
                <option>Normal</option>
              </select>
            </label>
            <label>
              From
              <input
                type="date"
                value={filters.from}
                onChange={(event) => updateFilter("from", event.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={filters.to}
                onChange={(event) => updateFilter("to", event.target.value)}
              />
            </label>
          </div>
          <button
            className="ph-text-button"
            type="button"
            onClick={resetFilters}
          >
            <FiRotateCcw />
            Reset filters
          </button>
        </div>
      )}
      <div className="ph-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "is-active" : ""}
            role="tab"
            aria-selected={activeTab === tab}
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="ph-bulk-bar">
        <span>
          {selectedRows.length
            ? `${selectedRows.length} selected`
            : `${filteredRows.length} results`}
        </span>
        <div>
          <button
            className="ph-text-button"
            type="button"
            onClick={() => runBulk("print")}
          >
            <FiPrinter />
            Bulk print
          </button>
          <button
            className="ph-text-button"
            type="button"
            onClick={() => runBulk("invoice")}
          >
            <FiFileText />
            Bulk invoice
          </button>
          <button
            className="ph-text-button"
            type="button"
            onClick={() => runBulk("status")}
          >
            <FiCheck />
            Update status
          </button>
        </div>
      </div>
      <div className="ph-table-wrap">
        <table className="ph-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  aria-label="Select all visible prescriptions"
                />
              </th>
              {[
                ["id", "RX ID"],
                ["patient", "Patient"],
                ["physician", "Physician"],
                ["priority", "Priority"],
                ["createdAt", "Created At"],
                ["status", "Status"],
              ].map(([field, label]) => (
                <th key={field}>
                  <button type="button" onClick={() => toggleSort(field)}>
                    {label}
                    <FiSliders />
                  </button>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((item) => (
              <tr key={item._id || item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleRow(item.id)}
                    aria-label={`Select ${item.id}`}
                  />
                </td>
                <td>
                  <button
                    className="ph-rx-link"
                    type="button"
                    onClick={() => runAction(item, "View")}
                  >
                    #{item.id}
                  </button>
                </td>
                <td>
                  <strong>{item.patient}</strong>
                  <small>{item.patientId}</small>
                </td>
                <td>{item.physician}</td>
                <td>
                  <span
                    className={`ph-priority ${item.priority.toLowerCase()}`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td>{item.createdAt}</td>
                <td>
                  <span className={`ph-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="ph-row-actions">
                    <button
                      className="ph-icon-button"
                      type="button"
                      aria-label={`View ${item.id}`}
                      onClick={() => runAction(item, "View")}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="ph-icon-button"
                      type="button"
                      aria-label={`Print ${item.id}`}
                      onClick={() => runAction(item, "Print")}
                    >
                      <FiPrinter />
                    </button>
                    <button
                      className={`ph-icon-button ${menuId === item.id ? "is-active" : ""}`}
                      type="button"
                      aria-label={`More actions for ${item.id}`}
                      onClick={(event) => openMenu(event, item)}
                    >
                      <FiMoreVertical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pageRows.length && (
          <div className="ph-empty-state">
            <FiSearch />
            <h3>No prescriptions found</h3>
            <p>Try clearing a filter or changing your search.</p>
            <button
              className="ph-secondary-button"
              type="button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
      {activeMenuItem && menuPos && (
        <>
          <div className="ph-menu-backdrop" onClick={closeMenu} />
          <div
            className="ph-floating-menu"
            role="menu"
            aria-label={`Actions for ${activeMenuItem.id}`}
            style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          >
            <header className="ph-floating-menu-header">
              <strong>{activeMenuItem.id}</strong>
              <span>{activeMenuItem.patient}</span>
            </header>
            {rowActions.map(({ label, icon: Icon }) => (
              <button
                className="ph-floating-menu-item"
                disabled={Boolean(busyAction)}
                type="button"
                key={label}
                onClick={() => runAction(activeMenuItem, label)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="ph-pagination">
        <span>
          Showing {pageRows.length ? (safePage - 1) * pageSize + 1 : 0} to{" "}
          {(safePage - 1) * pageSize + pageRows.length} of {filteredRows.length}{" "}
          entries
        </span>
        <div>
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <FiChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              type="button"
              className={safePage === index + 1 ? "is-active" : ""}
              key={index}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={safePage === totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
      {detailPrescription && (
  <PrescriptionModal
  prescription={detailPrescription}
  detailTab={detailTab}
  setDetailTab={setDetailTab}
  onClose={() => setDetailPrescription(null)}
  onUpdateQuantity={updateItemQuantity}
  getItemQuantity={getItemQuantity}
  onCreateOrder={handleCreatePharmacyOrder}
  creatingOrder={creatingOrder}
  pharmacyOrder={pharmacyOrder}
  loadingOrder={loadingOrder}
  onAction={onAction}
  onLoadToBilling={onLoadToBilling}
  onDownloadPdf={onDownloadPdf}
  onPrint={onPrint}
  busyAction={busyAction}
/>
)}
      {doctorMessage && (
        <Modal
          title={`Contact ${doctorMessage.physician}`}
          onClose={() => setDoctorMessage(null)}
        >
          <div className="ph-modal-body">
            <label>
              Secure message
              <textarea
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                rows="5"
              />
            </label>
            <div className="ph-modal-actions">
              <button
                className="ph-secondary-button"
                type="button"
                onClick={() => setDoctorMessage(null)}
              >
                Cancel
              </button>
              <button
                className="ph-primary-button"
                type="button"
                onClick={sendDoctorMessage}
              >
                <FiMail />
                Send message
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function PrescriptionModal({
  prescription,
  pharmacyOrder,
  loadingOrder,
  onUpdateQuantity,
  getItemQuantity,
  onCreateOrder,
  creatingOrder,
  detailTab,
  setDetailTab,
  onClose,
  onAction,
  onLoadToBilling,
  onDownloadPdf,
  onPrint,
  busyAction,
}) {
  const isNew = prescription.isNew;
  const [newOrder, setNewOrder] = useState({
    patient: prescription.patient,
    physician: prescription.physician,
    department: prescription.department,
    priority: prescription.priority,
  });
  const [error, setError] = useState("");

  const createOrder = () => {
    if (!newOrder.patient.trim() || !newOrder.physician.trim()) {
      setError("Patient and physician are required.");
      return;
    }
    onAction("new", "Create Order", newOrder);
    onClose();
  };

  if (isNew)
    return (
      <Modal title="New Prescription Order" onClose={onClose}>
        <div className="ph-modal-body">
          <div className="ph-form-grid">
            <label>
              Patient
              <input
                value={newOrder.patient}
                onChange={(event) =>
                  setNewOrder((current) => ({
                    ...current,
                    patient: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Physician
              <input
                value={newOrder.physician}
                onChange={(event) =>
                  setNewOrder((current) => ({
                    ...current,
                    physician: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Department
              <input
                value={newOrder.department}
                onChange={(event) =>
                  setNewOrder((current) => ({
                    ...current,
                    department: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Priority
              <select
                value={newOrder.priority}
                onChange={(event) =>
                  setNewOrder((current) => ({
                    ...current,
                    priority: event.target.value,
                  }))
                }
              >
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </label>
          </div>
          {error && (
            <p className="ph-form-error">
              <FiAlertTriangle />
              {error}
            </p>
          )}
          <div className="ph-modal-actions">
            <button
              className="ph-secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="ph-primary-button"
              type="button"
              onClick={createOrder}
            >
              Create order
            </button>
          </div>
        </div>
      </Modal>
    );

  const patientContent = {
    "Patient Profile": (
  <dl className="ph-detail-list">

    <div>
      <dt>Patient ID</dt>
      <dd>{prescription.patientId || "-"}</dd>
    </div>

    <div>
      <dt>Full Name</dt>
      <dd>{prescription.patient || "-"}</dd>
    </div>

    <div>
      <dt>Email</dt>
      <dd>{prescription.patientEmail || "-"}</dd>
    </div>

    <div>
      <dt>Phone</dt>
      <dd>{prescription.patientPhone || "-"}</dd>
    </div>

    <div>
      <dt>Gender</dt>
      <dd>{prescription.gender || "-"}</dd>
    </div>

    <div>
      <dt>Date of Birth</dt>
      <dd>
        {prescription.dateOfBirth
          ? new Date(
              prescription.dateOfBirth
            ).toLocaleDateString("en-IN")
          : "-"}
      </dd>
    </div>

    <div>
      <dt>Blood Group</dt>
      <dd>{prescription.bloodGroup || "-"}</dd>
    </div>

    <div>
      <dt>Address</dt>
      <dd>{prescription.address || "-"}</dd>
    </div>

    <div>
      <dt>Emergency Contact</dt>
      <dd>
        {prescription.emergencyContact?.name ||
          "-"}
      </dd>
    </div>

    <div>
      <dt>Emergency Phone</dt>
      <dd>
        {prescription.emergencyContact?.phone ||
          "-"}
      </dd>
    </div>

  </dl>
),
    "Medical Reports": (
  <div className="ph-empty-state">
    <FiFileText />

    <h3>Medical Reports</h3>

    <p>
      No diagnostic reports are available
      in this prescription response.
    </p>
  </div>
),
   "Previous Prescriptions": (
  <div className="ph-record-list">
    {prescription.previousPrescriptions?.length > 0 ? (
      prescription.previousPrescriptions.map(
        (previous) => (
          <div
            key={previous._id}
            className="ph-record-item"
          >
            <strong>
              Prescription #{previous._id}
            </strong>

            <span>
              Diagnosis:{" "}
              {previous.diagnosis || "-"}
            </span>

            <span>
              Status:{" "}
              {previous.status || "-"}
            </span>

            <span>
              Date:{" "}
              {new Date(
                previous.updatedAt ||
                  previous.createdAt
              ).toLocaleDateString("en-IN")}
            </span>
          </div>
        )
      )
    ) : (
      <div className="ph-empty-state">
        No previous prescriptions found.
      </div>
    )}
  </div>
),
    Allergies: (
  <div className="ph-alert-box">

    <FiAlertTriangle />

    <div>

      <strong>
        {prescription.allergies?.length
          ? prescription.allergies.join(", ")
          : "No known allergies"}
      </strong>

      <span>
        Confirm before dispensing.
      </span>

    </div>

  </div>
),
    "Doctor Notes": (
      <div className="ph-note-box">
        {prescription.notes || "No additional prescribing notes."}
      </div>
    ),
    History: (
  <div className="ph-record-list">

    <p>
      Created:{" "}
      {prescription.createdAt
        ? new Date(
            prescription.createdAt
          ).toLocaleString("en-IN")
        : "-"}
    </p>

    <p>
      Last Updated:{" "}
      {prescription.updatedAt
        ? new Date(
            prescription.updatedAt
          ).toLocaleString("en-IN")
        : "-"}
    </p>

    <p>
      Status: {prescription.status || "-"}
    </p>

    <p>
      Diagnosis:{" "}
      {prescription.diagnosis || "-"}
    </p>

    <p>
      Follow-up Date:{" "}
      {prescription.followUpDate
        ? new Date(
            prescription.followUpDate
          ).toLocaleDateString("en-IN")
        : "-"}
    </p>

  </div>
),
  };

  return (
    <Modal title={`Prescription ${getPrescriptionId(prescription) || prescription.id || "New"}`} onClose={onClose}>
      <div className="ph-modal-body">
        <div className="ph-detail-tabs">
          {detailTabs.map((tab) => (
            <button
              className={detailTab === tab ? "is-active" : ""}
              type="button"
              key={tab}
              onClick={() => setDetailTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {detailTab === "Prescription" ? (
          <>
            <dl className="ph-detail-list">
              <div>
                <dt>Patient</dt>
                <dd>{prescription.patient}</dd>
              </div>
              <div>
                <dt>Prescribing doctor</dt>
                <dd>{prescription.physician}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{prescription.department}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{prescription.priority}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{prescription.status}</dd>
              </div>
            </dl>
            <div className="ph-item-list">
  {prescription.items.map((item) => (
    <div key={item.id || item.name}>

      {/* Medicine information */}
      <span>
        <strong>{item.name}</strong>

        <small>
          {item.genericName}
          {item.strength
            ? ` · ${item.strength}`
            : ""}
        </small>

        <small>
          Category: {item.category || "-"}
        </small>

        <small>
          Dosage: {item.dosage || "-"}
        </small>

        <small>
          Frequency: {item.frequency || "-"}
        </small>

        <small>
          Duration: {item.duration || "-"}
        </small>

        <small>
          Instructions:{" "}
          {item.instructions || "-"}
        </small>
      </span>

      {/* Quantity controls */}
      <div className="ph-prescription-quantity">

        <button
          type="button"
          onClick={() =>
            onUpdateQuantity(item, -1)
          }
          disabled={
            getItemQuantity(item) <= 1
          }
        >
          -
        </button>

        <span>
          {getItemQuantity(item)} units
        </span>

        <button
          type="button"
          onClick={() =>
            onUpdateQuantity(item, 1)
          }
        >
          +
        </button>

      </div>

    </div>
  ))}
</div>
            <div className="ph-modal-actions ph-wrap-actions">
              <button
                className="ph-secondary-button"
                type="button"
                onClick={() =>
                  printPrescriptionDocuments(
                    [prescription],
                    `Prescription ${getPrescriptionId(prescription) || prescription.id}`,
                  )
                }
              >
                <FiPrinter />
                Print
              </button>
              <button
                className="ph-secondary-button"
                type="button"
                onClick={() =>
                  onDownloadPdf(`${prescription.id}-prescription.pdf`, [
                    `Prescription ${prescription.id}`,
                    `Patient: ${prescription.patient}`,
                  ])
                }
              >
                <FiDownload />
                Download PDF
              </button>
              <button
                className="ph-secondary-button"
                type="button"
                onClick={() => onLoadToBilling(prescription)}
              >
                <FiFileText />
                Generate invoice
              </button>
              <button
                className="ph-primary-button"
                disabled={Boolean(busyAction)}
                type="button"
                onClick={() => onAction(prescription, "Dispense")}
              >
                <FiCheck />
                Dispense
              </button>
              {loadingOrder ? (
  <button
    className="ph-primary-button"
    type="button"
    disabled
  >
    Checking Order...
  </button>
) : pharmacyOrder ? (
  <div className="ph-pharmacy-order-status">
    <div>
      <strong>
        Pharmacy Order Created
      </strong>

      <span>
        Order #{pharmacyOrder._id}
      </span>
    </div>

    <div className="ph-order-status-row">
      <span>
        Payment:{" "}
        {pharmacyOrder.paymentStatus}
      </span>

      <span>
        Dispensing:{" "}
        {pharmacyOrder.dispensingStatus}
      </span>
    </div>
  </div>
) : (
  <button
    className="ph-primary-button"
    type="button"
    onClick={onCreateOrder}
    disabled={creatingOrder}
  >
    {creatingOrder
      ? "Creating Order..."
      : "Create Pharmacy Order"}
  </button>
)}
            </div>
          </>
        ) : (
          patientContent[detailTab]
        )}
      </div>
    </Modal>
  );
}

export default PharmacyPrescription;