import { useState,useEffect } from "react";

import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import {
  createDepartment,
  updateDepartment,
} from "../../../../services/adminDepartmentService";
import {
  FormGroup,
  FormLabel,
  Input,
  Textarea,
} from "../../components/ui/FormControls/FormControls";

function DepartmentForm({
  mode = "add",
  department = null,
  onCancel,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    consultationDuration: "",
    consultationFee: "",
  });

  useEffect(() => {
    if (mode === "edit" && department) {
      setFormData({
        name: department.name || "",
        code: department.code || "",
        description: department.description || "",
        consultationDuration: department.consultationDuration ?? "",
        consultationFee: department.consultationFee ?? "",
      });
    }
  }, [mode, department]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        consultationDuration: Number(formData.consultationDuration),
        consultationFee: Number(formData.consultationFee),
      };

      if (mode === "edit") {
        await updateDepartment(department._id, payload);

        alert("Department updated successfully.");
      } else {
        await createDepartment(payload);

        alert("Department created successfully.");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving department:", error);

      setError(error.response?.data?.message || "Failed to save department.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={mode === "edit" ? "Edit Department" : "Add Department"}
      subtitle={
        mode === "edit"
          ? "Update department information"
          : "Create a new hospital department"
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <div className="row">
          {/* Department Name */}
          <FormGroup>
            <FormLabel htmlFor="name" required>
              Department Name
            </FormLabel>

            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Cardiology"
              required
            />
          </FormGroup>

          {/* Department Code */}
          <FormGroup>
            <FormLabel htmlFor="code" required>
              Department Code
            </FormLabel>

            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CAR"
              required
            />
          </FormGroup>

          {/* Consultation Duration */}
          <FormGroup>
            <FormLabel htmlFor="consultationDuration" required>
              Consultation Duration
            </FormLabel>

            <Input
              id="consultationDuration"
              name="consultationDuration"
              type="number"
              value={formData.consultationDuration}
              onChange={handleChange}
              placeholder="e.g. 15"
              required
            />

            <small className="text-muted">Duration in minutes</small>
          </FormGroup>

          {/* Consultation Fee */}
          <FormGroup>
            <FormLabel htmlFor="consultationFee" required>
              Consultation Fee
            </FormLabel>

            <Input
              id="consultationFee"
              name="consultationFee"
              type="number"
              value={formData.consultationFee}
              onChange={handleChange}
              placeholder="e.g. 700"
              required
            />

            <small className="text-muted">Fee in INR</small>
          </FormGroup>

          {/* Description */}
          <FormGroup colSpan={2}>
            <FormLabel htmlFor="description">Description</FormLabel>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter department description"
              rows={4}
            />
          </FormGroup>
        </div>

        {/* Form Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <Button
            variant="secondary"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button variant="primary" type="submit" loading={loading}>
            {mode === "edit" ? "Update Department" : "Create Department"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default DepartmentForm;
