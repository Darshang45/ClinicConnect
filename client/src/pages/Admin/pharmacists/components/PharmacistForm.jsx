import React, { useEffect, useState } from "react";
import {
  createPharmacist,
  updatePharmacist,
} from "../../../../services/AdminPharmacistService";
import {
  PageHeader,
  Card,
  CardBody,
  FormGroup,
  FormLabel,
  Input,
  Button,
  Alert,
} from "../../components/ui";
import { getApiErrorMessage } from "../../../../services/api";

function PharmacistForm({ mode = "add", onCancel, onSuccess, pharmacist }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (mode === "edit" && pharmacist) {
      setFormData({
        fullName: pharmacist.fullName || "",
        email: pharmacist.email || "",
        phone: pharmacist.phone || "",
        password: "",
      });
    }
  }, [pharmacist, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      let response;

      if (mode === "add") {
        response = await createPharmacist(formData);
      } else {
        const pharmId = pharmacist._id || pharmacist.id;
        response = await updatePharmacist(pharmId, formData);
      }
      if (onSuccess) onSuccess(response?.message);
    } catch (error) {
      console.error(error);
      setErrorMsg(getApiErrorMessage(
        error,
        `Failed to ${mode === "add" ? "create" : "update"} pharmacist.`
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-form-page">
      <PageHeader
        title={mode === "add" ? "Add Pharmacist" : "Edit Pharmacist"}
        subtitle={
          mode === "add"
            ? "Register a new hospital pharmacist account for inventory management"
            : `Updating pharmacist details for ${pharmacist?.fullName || "Staff"}`
        }
      >
        <Button variant="outline-secondary" onClick={onCancel}>
          <i className="bi bi-arrow-left me-1"></i> Back to Pharmacists
        </Button>
      </PageHeader>

      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>}

      <Card className="staff-form-card">
        <CardBody>
          <form className="staff-form" onSubmit={handleSubmit}>
            <h6 className="staff-form-section-title">Pharmacist Account Details</h6>
            <div className="row g-4 staff-form-grid">
              <FormGroup>
                <FormLabel required>Full Name</FormLabel>
                <Input
                  name="fullName"
                  placeholder="e.g. John Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Email Address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="pharmacist@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Phone Number</FormLabel>
                <Input
                  name="phone"
                  placeholder="+91 98765 99887"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              {mode === "add" && (
                <FormGroup>
                  <FormLabel required>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Set secure access password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              )}
            </div>

            <div className="form-actions-sticky">
              <Button variant="secondary" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                <i className="bi bi-check-circle me-1"></i>
                {mode === "add" ? "Save Pharmacist" : "Update Account"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default PharmacistForm;
