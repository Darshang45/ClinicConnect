import React, { useEffect, useState } from "react";
import {
  createReceptionist,
  updateReceptionist,
} from "../../../../services/AdminReceptionistService";
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

function ReceptionistForm({ mode = "add", onCancel, onSuccess, receptionist }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (mode === "edit" && receptionist) {
      setFormData({
        fullName: receptionist.fullName || "",
        email: receptionist.email || "",
        phone: receptionist.phone || "",
        password: "",
      });
    }
  }, [receptionist, mode]);

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
      if (mode === "add") {
        await createReceptionist(formData);
      } else {
        const recId = receptionist._id || receptionist.id;
        await updateReceptionist(recId, formData);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message ||
          `Failed to ${mode === "add" ? "create" : "update"} receptionist.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-form-page">
      <PageHeader
        title={mode === "add" ? "Add Receptionist" : "Edit Receptionist"}
        subtitle={
          mode === "add"
            ? "Register a new front desk receptionist account for patient intake"
            : `Updating receptionist details for ${receptionist?.fullName || "Staff"}`
        }
      >
        <Button variant="outline-secondary" onClick={onCancel}>
          <i className="bi bi-arrow-left me-1"></i> Back to Receptionists
        </Button>
      </PageHeader>

      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>}

      <Card className="staff-form-card">
        <CardBody>
          <form className="staff-form" onSubmit={handleSubmit}>
            <h6 className="staff-form-section-title">Receptionist Account Details</h6>
            <div className="row g-4 staff-form-grid">
              <FormGroup>
                <FormLabel required>Full Name</FormLabel>
                <Input
                  name="fullName"
                  placeholder="e.g. Jane Doe"
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
                  placeholder="receptionist@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Phone Number</FormLabel>
                <Input
                  name="phone"
                  placeholder="+91 98765 12345"
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
                {mode === "add" ? "Save Receptionist" : "Update Account"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default ReceptionistForm;
