import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card/Card";

import Button from "../../components/ui/Button/Button";
import Badge from "../../components/ui/Badge/Badge";

function PatientDetails({
  patient,
  onBack,
  onDelete,
}) {
  if (!patient) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>

      {/* Header */}
      <CardHeader>

        <div className="d-flex justify-content-between align-items-center">

          <div>
            <h4 className="mb-1">
              Patient Details
            </h4>

            <p className="text-muted mb-0">
              View patient information
            </p>
          </div>

          <Badge
            variant={
              patient.isActive
                ? "success"
                : "danger"
            }
          >
            {patient.isActive
              ? "Active"
              : "Inactive"}
          </Badge>

        </div>

      </CardHeader>

      {/* Body */}
      <CardBody>

        {/* Basic Information */}
        <div className="mb-4">

          <h5 className="mb-3">
            Basic Information
          </h5>

          <div className="row g-3">

            <div className="col-md-6">
              <label className="text-muted small">
                Patient ID
              </label>

              <div className="fw-semibold">
                {patient.patientId}
              </div>
            </div>

            <div className="col-md-6">
              <label className="text-muted small">
                Full Name
              </label>

              <div className="fw-semibold">
                {patient.fullName}
              </div>
            </div>

            <div className="col-md-6">
              <label className="text-muted small">
                Email
              </label>

              <div>
                {patient.email || "-"}
              </div>
            </div>

            <div className="col-md-6">
              <label className="text-muted small">
                Phone
              </label>

              <div>
                {patient.phone || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <label className="text-muted small">
                Gender
              </label>

              <div>
                {patient.gender || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <label className="text-muted small">
                Date of Birth
              </label>

              <div>
                {formatDate(patient.dateOfBirth)}
              </div>
            </div>

            <div className="col-md-4">
              <label className="text-muted small">
                Blood Group
              </label>

              <div>
                {patient.bloodGroup || "-"}
              </div>
            </div>

          </div>

        </div>

        <hr />

        {/* Contact Information */}
        <div className="my-4">

          <h5 className="mb-3">
            Contact Information
          </h5>

          <div className="row g-3">

            <div className="col-12">
              <label className="text-muted small">
                Address
              </label>

              <div>
                {patient.address || "-"}
              </div>
            </div>

          </div>

        </div>

        <hr />

        {/* Emergency Contact */}
        <div className="my-4">

          <h5 className="mb-3">
            Emergency Contact
          </h5>

          <div className="row g-3">

            <div className="col-md-4">
              <label className="text-muted small">
                Name
              </label>

              <div>
                {patient.emergencyContact?.name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <label className="text-muted small">
                Relation
              </label>

              <div>
                {patient.emergencyContact?.relation || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <label className="text-muted small">
                Phone
              </label>

              <div>
                {patient.emergencyContact?.phone || "-"}
              </div>
            </div>

          </div>

        </div>

        <hr />

        {/* Medical Information */}
        <div className="my-4">

          <h5 className="mb-3">
            Medical Information
          </h5>

          <div className="row g-3">

            <div className="col-md-6">

              <label className="text-muted small">
                Allergies
              </label>

              <div>
                {patient.allergies?.length
                  ? patient.allergies.join(", ")
                  : "None"}
              </div>

            </div>

            <div className="col-md-6">

              <label className="text-muted small">
                Chronic Diseases
              </label>

              <div>
                {patient.chronicDiseases?.length
                  ? patient.chronicDiseases.join(", ")
                  : "None"}
              </div>

            </div>

          </div>

        </div>

        <hr />

        {/* Insurance */}
        <div className="my-4">

          <h5 className="mb-3">
            Insurance
          </h5>

          <div className="row g-3">

            <div className="col-md-6">

              <label className="text-muted small">
                Provider
              </label>

              <div>
                {patient.insurance?.provider || "-"}
              </div>

            </div>

            <div className="col-md-6">

              <label className="text-muted small">
                Policy Number
              </label>

              <div>
                {patient.insurance?.policyNumber || "-"}
              </div>

            </div>

          </div>

        </div>

      </CardBody>

      {/* Footer */}
      <div className="card-footer d-flex justify-content-end gap-2">

        <Button
          variant="secondary"
          onClick={onBack}
        >
          Back
        </Button>

        {patient.isActive && (
          <Button
            variant="danger"
            icon="trash"
            onClick={onDelete}
          >
            Delete Patient
          </Button>
        )}

      </div>

    </Card>
  );
}

export default PatientDetails;