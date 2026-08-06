import { useState, useEffect, useCallback } from "react";
import {
  FiActivity,
  FiHeart,
  FiThermometer,
  FiDroplet,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import Card from "../../../components/common/Card";
import Modal from "../../../components/common/Modal";
import {
  getPatientHealthMetrics,
  createPatientHealthMetric,
  updatePatientHealthMetric,
  deletePatientHealthMetric,
} from "../../../services/patientService";
import {
  evalBloodPressure,
  evalHeartRate,
  evalBMI,
  evalBloodSugar,
  evalOxygenLevel,
  evalTemperature,
} from "../../../utils/healthMetricHelper";
import "../../../styles/patient_dashboard.css";

const BLANK_FORM = {
  height: "",
  weight: "",
  bloodPressure: "",
  heartRate: "",
  bloodSugar: "",
  oxygenLevel: "",
  temperature: "",
  notes: "",
  recordedAt: new Date().toISOString().slice(0, 10),
};

function MetricCard({ icon, label, value, unit, status }) {
  return (
    <Card className="hm-card">
      <span className="hm-card-icon">{icon}</span>
      <span className="hm-card-label">{label}</span>
      <strong className="hm-card-value">
        {value !== null && value !== undefined && value !== "" ? (
          <>
            {value}
            {unit && <small className="hm-card-unit"> {unit}</small>}
          </>
        ) : (
          <span className="hm-card-empty">—</span>
        )}
      </strong>
      {status && (
        <span className={`hm-status ${status.cls}`}>{status.label}</span>
      )}
    </Card>
  );
}

function HealthMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [totalMetrics, setTotalMetrics] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const LIMIT = 10;

  const fetchMetrics = useCallback(async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const data = await getPatientHealthMetrics({ page, limit: LIMIT });
      setTotalMetrics(data.totalMetrics);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      setMetrics((prev) => (append ? [...prev, ...data.metrics] : data.metrics));
      setError(null);
    } catch {
      setError("Failed to load health metrics. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(1);
  }, [fetchMetrics]);

  const latest = metrics[0] || null;

  // Prefill height from the most recent record (height rarely changes)
  const defaultHeight = latest?.height ?? "";

  const openAdd = () => {
    setForm({ ...BLANK_FORM, height: defaultHeight, recordedAt: new Date().toISOString().slice(0, 10) });
    setFormError("");
    setModalMode("add");
    setEditTarget(null);
    setShowModal(true);
  };

  const openEdit = (metric) => {
    setForm({
      height: metric.height ?? "",
      weight: metric.weight ?? "",
      bloodPressure: metric.bloodPressure ?? "",
      heartRate: metric.heartRate ?? "",
      bloodSugar: metric.bloodSugar ?? "",
      oxygenLevel: metric.oxygenLevel ?? "",
      temperature: metric.temperature ?? "",
      notes: metric.notes ?? "",
      recordedAt: metric.recordedAt
        ? new Date(metric.recordedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });
    setFormError("");
    setModalMode("edit");
    setEditTarget(metric);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Preview BMI calculation for display in the form
  const previewBMI = (() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
      return Math.round((w / Math.pow(h / 100, 2)) * 10) / 10;
    }
    return null;
  })();

  const buildPayload = () => {
    const payload = {};
    if (form.height !== "") payload.height = parseFloat(form.height);
    if (form.weight !== "") payload.weight = parseFloat(form.weight);
    if (form.bloodPressure !== "") payload.bloodPressure = form.bloodPressure.trim();
    if (form.heartRate !== "") payload.heartRate = parseFloat(form.heartRate);
    if (form.bloodSugar !== "") payload.bloodSugar = parseFloat(form.bloodSugar);
    if (form.oxygenLevel !== "") payload.oxygenLevel = parseFloat(form.oxygenLevel);
    if (form.temperature !== "") payload.temperature = parseFloat(form.temperature);
    if (form.notes !== "") payload.notes = form.notes.trim();
    if (form.recordedAt) payload.recordedAt = form.recordedAt;
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const payload = buildPayload();
    // Must have at least one vital (beyond the date)
    const vitalKeys = ["height", "weight", "bloodPressure", "heartRate", "bloodSugar", "oxygenLevel", "temperature"];
    if (!vitalKeys.some((k) => payload[k] !== undefined)) {
      setFormError("Please enter at least one vital measurement.");
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await createPatientHealthMetric(payload);
      } else {
        await updatePatientHealthMetric(editTarget._id, payload);
      }
      closeModal();
      fetchMetrics(1);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deletePatientHealthMetric(id);
      setDeleteId(null);
      fetchMetrics(1);
    } catch {
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchMetrics(currentPage + 1, true);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const shownCount = metrics.length;
  const allLoaded = shownCount >= totalMetrics;

  return (
    <section className="pd-detail-section" id="health-metrics">
      {/* Section Header */}
      <div className="pd-section-heading">
        <h2>Health Metrics</h2>
        <button className="hm-add-btn" onClick={openAdd} id="hm-add-vitals-btn">
          <FiPlus />
          <span>Add Vitals</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="hm-error-banner">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="hm-loading">
          <FiLoader className="hm-spin" />
          <span>Loading health metrics…</span>
        </div>
      ) : (
        <>
          {/* Summary Cards — Latest Reading */}
          <div className="pd-metric-grid">
            <MetricCard
              icon={<FiHeart />}
              label="Blood Pressure"
              value={latest?.bloodPressure || null}
              unit="mmHg"
              status={evalBloodPressure(latest?.bloodPressure)}
            />
            <MetricCard
              icon={<FiActivity />}
              label="Heart Rate"
              value={latest?.heartRate ?? null}
              unit="bpm"
              status={evalHeartRate(latest?.heartRate)}
            />
            <MetricCard
              icon={<FiActivity />}
              label="Weight"
              value={latest?.weight ?? null}
              unit="kg"
              status={latest?.weight ? { label: "Recorded", cls: "hm-status--info" } : null}
            />
            <MetricCard
              icon={<FiActivity />}
              label="BMI"
              value={latest?.bmi ?? null}
              unit=""
              status={evalBMI(latest?.bmi)}
            />
            <MetricCard
              icon={<FiDroplet />}
              label="Blood Sugar"
              value={latest?.bloodSugar ?? null}
              unit="mg/dL"
              status={evalBloodSugar(latest?.bloodSugar)}
            />
            <MetricCard
              icon={<FiActivity />}
              label="Oxygen Level"
              value={latest?.oxygenLevel ?? null}
              unit="%"
              status={evalOxygenLevel(latest?.oxygenLevel)}
            />
            <MetricCard
              icon={<FiThermometer />}
              label="Temperature"
              value={latest?.temperature ?? null}
              unit="°F"
              status={evalTemperature(latest?.temperature)}
            />
          </div>

          {/* History Toggle */}
          {totalMetrics > 0 && (
            <div className="hm-history-section">
              <button
                className="hm-history-toggle"
                onClick={() => setShowHistory((v) => !v)}
                id="hm-history-toggle-btn"
                aria-expanded={showHistory}
              >
                <span>
                  {showHistory ? "Hide" : "Show"} History
                  <small> ({totalMetrics} record{totalMetrics !== 1 ? "s" : ""})</small>
                </span>
                <FiChevronDown className={showHistory ? "hm-chevron-up" : ""} />
              </button>

              {showHistory && (
                <div className="hm-history-list">
                  {metrics.map((m) => (
                    <div className="hm-history-row" key={m._id}>
                      <div className="hm-history-date">
                        <span>{formatDate(m.recordedAt)}</span>
                        <small>{m.recordedBy}</small>
                      </div>
                      <div className="hm-history-vitals">
                        {m.bloodPressure && <span><strong>{m.bloodPressure}</strong> mmHg</span>}
                        {m.heartRate && <span><strong>{m.heartRate}</strong> bpm</span>}
                        {m.weight && <span><strong>{m.weight}</strong> kg</span>}
                        {m.bmi && <span>BMI <strong>{m.bmi}</strong></span>}
                        {m.bloodSugar && <span><strong>{m.bloodSugar}</strong> mg/dL</span>}
                        {m.oxygenLevel && <span>SpO₂ <strong>{m.oxygenLevel}</strong>%</span>}
                        {m.temperature && <span><strong>{m.temperature}</strong>°F</span>}
                      </div>
                      {m.notes && <p className="hm-history-notes">{m.notes}</p>}
                      <div className="hm-history-actions">
                        <button
                          className="hm-icon-btn hm-icon-btn--edit"
                          onClick={() => openEdit(m)}
                          title="Edit"
                          id={`hm-edit-btn-${m._id}`}
                        >
                          <FiEdit2 />
                        </button>
                        {deleteId === m._id ? (
                          <div className="hm-delete-confirm">
                            <span>Delete?</span>
                            <button
                              className="hm-confirm-btn hm-confirm-btn--yes"
                              onClick={() => handleDelete(m._id)}
                              disabled={deleting}
                            >
                              {deleting ? "…" : "Yes"}
                            </button>
                            <button
                              className="hm-confirm-btn hm-confirm-btn--no"
                              onClick={() => setDeleteId(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            className="hm-icon-btn hm-icon-btn--delete"
                            onClick={() => setDeleteId(m._id)}
                            title="Delete"
                            id={`hm-delete-btn-${m._id}`}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pagination counter + Load More */}
                  <div className="hm-history-footer">
                    {allLoaded ? (
                      <span className="hm-history-counter">
                        Showing all {totalMetrics} record{totalMetrics !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="hm-history-counter">
                        Showing {shownCount} of {totalMetrics} records
                      </span>
                    )}
                    {!allLoaded && (
                      <button
                        className="hm-load-more-btn"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        id="hm-load-more-btn"
                      >
                        {loadingMore ? "⏳ Loading…" : "Load More"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {totalMetrics === 0 && (
            <div className="hm-empty">
              <FiActivity className="hm-empty-icon" />
              <p>No health records yet.</p>
              <small>Start tracking your vitals by clicking <strong>Add Vitals</strong>.</small>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Modal — uses existing Modal.jsx component */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={modalMode === "add" ? "Add Vitals" : "Edit Record"}
        className="hm-modal"
      >
        <form className="hm-modal-body" onSubmit={handleSubmit} id="hm-vitals-form">
          <div className="hm-modal-grid">
            {/* Height — prefilled from latest record; rarely changes */}
            <div className="pd-profile-field">
              <label htmlFor="hm-input-height">Height (cm)</label>
              <input
                type="number"
                id="hm-input-height"
                name="height"
                value={form.height}
                onChange={handleFormChange}
                placeholder="e.g. 175"
                min="0"
                step="0.1"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-weight">Weight (kg)</label>
              <input
                type="number"
                id="hm-input-weight"
                name="weight"
                value={form.weight}
                onChange={handleFormChange}
                placeholder="e.g. 70"
                min="0"
                step="0.1"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-bp">Blood Pressure</label>
              <input
                type="text"
                id="hm-input-bp"
                name="bloodPressure"
                value={form.bloodPressure}
                onChange={handleFormChange}
                placeholder="e.g. 120/80"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-hr">Heart Rate (bpm)</label>
              <input
                type="number"
                id="hm-input-hr"
                name="heartRate"
                value={form.heartRate}
                onChange={handleFormChange}
                placeholder="e.g. 72"
                min="0"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-sugar">Blood Sugar (mg/dL)</label>
              <input
                type="number"
                id="hm-input-sugar"
                name="bloodSugar"
                value={form.bloodSugar}
                onChange={handleFormChange}
                placeholder="e.g. 96"
                min="0"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-o2">Oxygen Level (%)</label>
              <input
                type="number"
                id="hm-input-o2"
                name="oxygenLevel"
                value={form.oxygenLevel}
                onChange={handleFormChange}
                placeholder="e.g. 98"
                min="0"
                max="100"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-temp">Temperature (°F)</label>
              <input
                type="number"
                id="hm-input-temp"
                name="temperature"
                value={form.temperature}
                onChange={handleFormChange}
                placeholder="e.g. 98.6"
                min="0"
                step="0.1"
              />
            </div>
            <div className="pd-profile-field">
              <label htmlFor="hm-input-date">Date Recorded</label>
              <input
                type="date"
                id="hm-input-date"
                name="recordedAt"
                value={form.recordedAt}
                onChange={handleFormChange}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          {/* BMI — displayed as calculated output, NOT an editable field */}
          {previewBMI !== null && (
            <div className="hm-bmi-hint">
              <FiActivity />
              <span>
                BMI will be automatically calculated:{" "}
                <strong>{previewBMI}</strong>
                {" "}({evalBMI(previewBMI)?.label})
              </span>
            </div>
          )}

          <div className="pd-profile-field hm-modal-grid--full">
            <label htmlFor="hm-input-notes">Notes (optional)</label>
            <textarea
              id="hm-input-notes"
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              placeholder="Add any additional notes…"
              rows={3}
            />
          </div>

          {formError && (
            <p className="hm-form-error">
              <FiAlertCircle />
              {formError}
            </p>
          )}

          <div className="hm-form-actions">
            <button
              type="button"
              className="pd-profile-edit"
              onClick={closeModal}
              style={undefined}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pd-profile-save"
              disabled={submitting}
              id="hm-form-submit-btn"
            >
              {submitting ? "Saving…" : modalMode === "add" ? "Save Record" : "Update Record"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default HealthMetrics;
