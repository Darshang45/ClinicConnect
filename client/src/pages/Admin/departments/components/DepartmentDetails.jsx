import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import Badge from "../../components/ui/Badge/Badge";

function DepartmentDetails({ department, onBack, onEdit }) {
  if (!department) {
    return <p>Department not found.</p>;
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="mb-1">Department Details</h2>
          <p className="text-muted mb-0">
            View department information
          </p>
        </div>

        <div className="d-flex gap-2">

          <Button
            variant="secondary"
            icon="arrow-left"
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            variant="primary"
            icon="pencil"
            onClick={() => onEdit(department)}
          >
            Edit
          </Button>

        </div>

      </div>

      {/* Main Card */}
      <Card
        title={department.name}
        subtitle={`Department Code: ${department.code}`}
      >

        <div className="row g-4">

          {/* Basic Information */}
          <div className="col-md-6">

            <h6 className="fw-semibold mb-3">
              Basic Information
            </h6>

            <div className="mb-3">
              <small className="text-muted d-block">
                Department Name
              </small>

              <strong>{department.name}</strong>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">
                Department Code
              </small>

              <strong>{department.code}</strong>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">
                Description
              </small>

              <span>
                {department.description || "No description available"}
              </span>
            </div>

          </div>

          {/* Consultation Information */}
          <div className="col-md-6">

            <h6 className="fw-semibold mb-3">
              Consultation Information
            </h6>

            <div className="mb-3">
              <small className="text-muted d-block">
                Consultation Duration
              </small>

              <strong>
                {department.consultationDuration} minutes
              </strong>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">
                Consultation Fee
              </small>

              <strong>
                ₹{department.consultationFee}
              </strong>
            </div>

            <div className="mb-3">
              <small className="text-muted d-block">
                Status
              </small>

              <Badge
                variant={department.isActive ? "success" : "danger"}
              >
                {department.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

          </div>

        </div>

      </Card>

    </div>
  );
}

export default DepartmentDetails;