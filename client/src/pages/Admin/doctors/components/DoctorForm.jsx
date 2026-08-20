import React, { useEffect, useState } from "react";
import {
  createDoctor,
  getDepartments,
  updateDoctor,
} from "../../../../services/AdminDoctorService";
import {
  PageHeader,
  Card,
  CardBody,
  FormGroup,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Alert,
} from "../../components/ui";
import { getApiErrorMessage } from "../../../../services/api";
import ProfilePhotoUpload from "../../../../components/common/ProfilePhotoUpload";
import doctorFallback from "../../../../assets/images/doctors/doctor-1.jpg";

function DoctorForm({ mode = "add", onCancel, onSuccess, doctor }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    licenseNumber: "",
    bio: "",
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (mode === "edit" && doctor) {
      setFormData({
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        password: "",
        department: doctor.departmentId || doctor.department || "",
        specialization: doctor.specialization || "",
        qualification: doctor.qualification || "",
        experience: doctor.experience || "",
        consultationFee: doctor.consultationFee || "",
        licenseNumber: doctor.licenseNumber || "",
        bio: doctor.bio || "",
      });
      setSelectedPhoto(null);
    }
  }, [doctor, mode]);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

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
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value ?? "");
      });
      if (selectedPhoto) payload.append("profilePhoto", selectedPhoto);

      let response;

      if (mode === "add") {
        response = await createDoctor(payload);
      } else {
        const docId = doctor.doctorId || doctor._id;
        response = await updateDoctor(docId, payload);
      }
      if (onSuccess) onSuccess(response?.message);
    } catch (error) {
      console.error(error);
      setErrorMsg(getApiErrorMessage(
        error,
        `Failed to ${mode === "add" ? "create" : "update"} doctor.`
      ));
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept._id,
    label: dept.name,
  }));

  return (
    <div className="staff-form-page">
      <PageHeader
        title={mode === "add" ? "Add New Doctor" : "Edit Doctor Profile"}
        subtitle={
          mode === "add"
            ? "Enter doctor personal credentials and professional specialization details"
            : `Updating details for ${doctor?.fullName || "Doctor"}`
        }
      >
        <Button variant="outline-secondary" onClick={onCancel}>
          <i className="bi bi-arrow-left me-1"></i> Back to Doctors
        </Button>
      </PageHeader>

      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>}

      <Card className="staff-form-card">
        <CardBody>
          <form className="staff-form" onSubmit={handleSubmit}>
            <h6 className="staff-form-section-title">Personal & Credentials</h6>
            <div className="row g-4 staff-form-grid">
              <FormGroup>
                <FormLabel required>Full Name</FormLabel>
                <Input
                  name="fullName"
                  placeholder="e.g. Dr. Sarah Chen"
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
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Phone Number</FormLabel>
                <Input
                  name="phone"
                  placeholder="+91 98765 43210"
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
                    placeholder="Set secure password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              )}

              <FormGroup>
                <ProfilePhotoUpload
                  currentPhoto={doctor?.profilePhoto}
                  fallbackImage={doctorFallback}
                  onFileChange={setSelectedPhoto}
                  disabled={loading}
                  resetKey={`${mode}-${doctor?.doctorId || "new"}`}
                />
              </FormGroup>
            </div>

            <hr className="staff-form-divider" />

            <h6 className="staff-form-section-title">Medical & Professional Details</h6>
            <div className="row g-4 staff-form-grid">
              <FormGroup>
                <FormLabel required>Department</FormLabel>
                <Select
                  name="department"
                  placeholder="Select Hospital Department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Specialization</FormLabel>
                <Input
                  name="specialization"
                  placeholder="e.g. Cardiology / Pediatrics"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Qualification</FormLabel>
                <Input
                  name="qualification"
                  placeholder="e.g. MBBS, MD, FACC"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Experience (Years)</FormLabel>
                <Input
                  type="number"
                  name="experience"
                  placeholder="e.g. 8"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>Consultation Fee (₹)</FormLabel>
                <Input
                  type="number"
                  name="consultationFee"
                  placeholder="e.g. 500"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel required>License / Registration Number</FormLabel>
                <Input
                  name="licenseNumber"
                  placeholder="e.g. MCI-2023-9912"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup colSpan={2}>
                <FormLabel>Doctor Biography</FormLabel>
                <Textarea
                  name="bio"
                  placeholder="Brief background summary and achievements..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                />
              </FormGroup>
            </div>

            <div className="form-actions-sticky">
              <Button variant="secondary" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                <i className="bi bi-check-circle me-1"></i>
                {mode === "add" ? "Save Doctor" : "Update Changes"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default DoctorForm;
