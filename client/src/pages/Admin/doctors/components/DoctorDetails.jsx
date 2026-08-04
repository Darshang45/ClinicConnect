import React from "react";
import {
  PageHeader,
  Card,
  CardBody,
  Button,
  Badge,
} from "../../components/ui";

function DoctorDetails({ doctor, onBack, onEdit, onDelete }) {
  if (!doctor) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <h5>No doctor selected.</h5>
          <Button variant="secondary" className="mt-3" onClick={onBack}>
            Back to List
          </Button>
        </CardBody>
      </Card>
    );
  }

  const initials = (doctor.fullName || "D")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="staff-details-page">
      <PageHeader
        title="Doctor Profile Details"
        subtitle={`Viewing comprehensive profile for Dr. ${doctor.fullName}`}
      >
        <Button variant="outline-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i> Back to List
        </Button>
        {onEdit && (
          <Button variant="primary" onClick={onEdit}>
            <i className="bi bi-pencil me-1"></i> Edit Profile
          </Button>
        )}
        {onDelete && (
          <Button variant="soft-danger" onClick={onDelete}>
            <i className="bi bi-trash me-1"></i> Delete
          </Button>
        )}
      </PageHeader>

      <div className="row g-4">
        {/* Left Column: Avatar & Summary */}
        <div className="col-lg-4 col-12">
          <Card className="text-center h-100">
            <CardBody className="d-flex flex-column align-items-center justify-content-center py-5">
              {doctor.profilePhoto ? (
                <img
                  src={doctor.profilePhoto}
                  alt={doctor.fullName}
                  className="rounded-circle object-fit-cover shadow mb-3"
                  style={{ width: "110px", height: "110px" }}
                />
              ) : (
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center shadow mb-3"
                  style={{
                    width: "110px",
                    height: "110px",
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  }}
                >
                  {initials}
                </div>
              )}
              <h4 className="fw-bold mb-1">{doctor.fullName}</h4>
              <p className="text-muted small mb-2">{doctor.qualification || "MD Specialist"}</p>
              <Badge variant={doctor.isAvailable !== false ? "success" : "danger"} showDot className="mb-3 fs-6">
                {doctor.isAvailable !== false ? "Available on Duty" : "Unavailable"}
              </Badge>

              <div className="w-100 border-top pt-3 mt-2 text-start">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small">Department</span>
                  <span className="fw-semibold small">{doctor.department || "N/A"}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small">Consultation Fee</span>
                  <span className="fw-bold text-success">₹{doctor.consultationFee || 0}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Experience</span>
                  <span className="fw-semibold small">{doctor.experience ? `${doctor.experience} Years` : "N/A"}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Detailed Sections */}
        <div className="col-lg-8 col-12">
          <Card className="h-100">
            <CardBody>
              <h5 className="fw-bold text-primary mb-3">Basic & Contact Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Full Name</span>
                    <strong className="text-dark fs-6">{doctor.fullName}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Email Address</span>
                    <strong className="text-dark fs-6">{doctor.email}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Phone Number</span>
                    <strong className="text-dark fs-6">{doctor.phone}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">License Number</span>
                    <strong className="text-dark fs-6">{doctor.licenseNumber || "N/A"}</strong>
                  </div>
                </div>
              </div>

              <h5 className="fw-bold text-primary mb-3">Professional Specialization</h5>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Department</span>
                    <strong className="text-dark fs-6">{doctor.department || "N/A"}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Specialization</span>
                    <strong className="text-dark fs-6">{doctor.specialization || "N/A"}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Qualification</span>
                    <strong className="text-dark fs-6">{doctor.qualification || "N/A"}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Experience</span>
                    <strong className="text-dark fs-6">{doctor.experience ? `${doctor.experience} Years` : "N/A"}</strong>
                  </div>
                </div>
              </div>

              {doctor.bio && (
                <>
                  <h5 className="fw-bold text-primary mb-2">Biography</h5>
                  <div className="p-3 bg-light rounded-3 text-muted small lh-base">
                    {doctor.bio}
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
