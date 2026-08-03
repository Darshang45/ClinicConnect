import React from "react";
import {
  PageHeader,
  Card,
  CardBody,
  Button,
  Badge,
} from "../../components/ui";

function ReceptionistDetails({ receptionist, onBack, onEdit, onDelete }) {
  if (!receptionist) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <h5>No receptionist selected.</h5>
          <Button variant="secondary" className="mt-3" onClick={onBack}>
            Back to List
          </Button>
        </CardBody>
      </Card>
    );
  }

  const initials = (receptionist.fullName || "R")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="staff-details-page">
      <PageHeader
        title="Receptionist Details"
        subtitle={`Viewing profile record for ${receptionist.fullName}`}
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
        <div className="col-lg-4 col-12">
          <Card className="text-center h-100">
            <CardBody className="d-flex flex-column align-items-center justify-content-center py-5">
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center shadow mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "2.25rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                }}
              >
                {initials}
              </div>
              <h4 className="fw-bold mb-1">{receptionist.fullName}</h4>
              <p className="text-muted small mb-2">Hospital Receptionist</p>
              <Badge variant={receptionist.isActive !== false ? "success" : "danger"} showDot className="mb-3 fs-6">
                {receptionist.isActive !== false ? "Active Staff Account" : "Inactive"}
              </Badge>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-8 col-12">
          <Card className="h-100">
            <CardBody>
              <h5 className="fw-bold text-primary mb-3">Account & Contact Information</h5>
              <div className="row g-3">
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Full Name</span>
                    <strong className="text-dark fs-6">{receptionist.fullName}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Email Address</span>
                    <strong className="text-dark fs-6">{receptionist.email}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Phone Number</span>
                    <strong className="text-dark fs-6">{receptionist.phone}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">System Role</span>
                    <strong className="text-dark fs-6">Receptionist</strong>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDetails;
