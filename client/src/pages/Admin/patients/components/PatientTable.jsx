import Button from "../../components/ui/Button/Button";
import Badge from "../../components/ui/Badge/Badge";
import Card from "../../components/ui/Card/Card";
import Pagination from "../../components/ui/Pagination/Pagination";

function PatientTable({
  patients,
  loading,
  error,
  pagination,
  search,
  onSearchChange,
  onPageChange,
  onRefresh,
  onView,
  onDelete,
}) {
  return (
    <Card
      title="Patients"
      subtitle="Manage hospital patients"
      headerAction={
        <Button variant="outline" icon="arrow-clockwise" onClick={onRefresh}>
          Refresh
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="Search patients by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-2 text-muted">Loading patients...</p>
        </div>
      ) : patients.length === 0 ? (
        /* Empty */
        <div className="text-center py-5">
          <i className="bi bi-people fs-1 text-muted"></i>

          <h5 className="mt-3">No patients found</h5>

          <p className="text-muted">No patient records match your search.</p>
        </div>
      ) : (
        /* Table */
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Patient ID</th>

                <th>Patient</th>

                <th>Phone</th>

                <th>Gender</th>

                <th>Blood Group</th>

                <th>Date of Birth</th>

                <th>Status</th>

                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  {/* Patient ID */}
                  <td>
                    <strong>{patient.patientId}</strong>
                  </td>

                  {/* Name */}
                  <td>
                    <div className="fw-semibold">{patient.fullName}</div>

                    {patient.email && (
                      <small className="text-muted">{patient.email}</small>
                    )}
                  </td>

                  {/* Phone */}
                  <td>{patient.phone}</td>

                  {/* Gender */}
                  <td>{patient.gender}</td>

                  {/* Blood Group */}
                  <td>{patient.bloodGroup || "-"}</td>

                  {/* DOB */}
                  <td>
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Status */}
                  <td>
                    <Badge variant={patient.isActive ? "success" : "danger"}>
                      {patient.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon="eye"
                        onClick={() => onView(patient)}
                      >
                        View
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        icon="trash"
                        onClick={() => onDelete(patient)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && patients.length > 0 && pagination && (
        <div className="mt-4">
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      )}
    </Card>
  );
}

export default PatientTable;
