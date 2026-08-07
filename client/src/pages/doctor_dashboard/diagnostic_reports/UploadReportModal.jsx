import { useState } from "react";

import {
  uploadPatientReport,
} from "../../../services/patientService";

import "../../../styles/doctor_dashboard.css";

const REPORT_TYPES = [
  "Blood Test",
  "Urine Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "ECG",
  "Ultrasound",
  "Other",
];

function UploadReportModal({
  appointment,
  onClose,
  onUploaded,
}) {
  const [form, setForm] = useState({
    reportType: "Blood Test",
    title: "",
    findings: "",
    remarks: "",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter report title.");
      return;
    }

    if (!file) {
      alert("Please choose a report file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (appointment?.appointmentId) {
        formData.append(
          "appointment",
          appointment.appointmentId
        );
      }

      formData.append(
        "reportType",
        form.reportType
      );

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "findings",
        form.findings
      );

      formData.append(
        "remarks",
        form.remarks
      );

      formData.append(
        "reportFile",
        file
      );

      const response = await uploadPatientReport(formData);

      if (response.success) {
        window.dispatchEvent(new Event("patient-report-uploaded"));

        if (onUploaded) {
          await onUploaded();
        }

        onClose();

        alert("Medical report uploaded successfully.");
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to upload report."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="doc-modal-overlay">

      <div className="doc-upload-modal">

        <div className="doc-upload-header">

          <h2>
            Upload Diagnostic Report
          </h2>

          <button
            type="button"
            className="doc-close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="doc-upload-form"
        >

          <div className="doc-form-group">

            <label>
              Report Type
            </label>

            <select
              value={form.reportType}
              onChange={(e) =>
                handleChange(
                  "reportType",
                  e.target.value
                )
              }
            >

              {REPORT_TYPES.map((type) => (

                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>

              ))}

            </select>

          </div>

          <div className="doc-form-group">

            <label>
              Report Title
            </label>

            <input
              type="text"
              placeholder="CBC Blood Test"
              value={form.title}
              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value
                )
              }
            />

          </div>

          <div className="doc-form-group">

            <label>
              Findings
            </label>

            <textarea
              rows={4}
              placeholder="Enter report findings..."
              value={form.findings}
              onChange={(e) =>
                handleChange(
                  "findings",
                  e.target.value
                )
              }
            />

          </div>

          <div className="doc-form-group">

            <label>
              Remarks
            </label>

            <textarea
              rows={3}
              placeholder="Additional remarks..."
              value={form.remarks}
              onChange={(e) =>
                handleChange(
                  "remarks",
                  e.target.value
                )
              }
            />

          </div>

          <div className="doc-form-group">

            <label>
              Upload Report
            </label>

           <input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  disabled={loading}
  onChange={(e) =>
    setFile(e.target.files[0])
  }
/>

            <small>
              Supported: PDF, JPG, JPEG, PNG (Max 10 MB)
            </small>

          </div>

          <div className="doc-upload-actions">

            <button
              type="button"
              className="doc-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="doc-btn-primary"
              disabled={loading}
            >
              {loading
                ? "Uploading..."
                : "Upload Report"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UploadReportModal;