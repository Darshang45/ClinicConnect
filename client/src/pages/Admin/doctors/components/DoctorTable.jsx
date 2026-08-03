import React from "react";
import {
  PageHeader,
  Card,
  SearchBar,
  Filters,
  Table,
  Badge,
  Button,
  Pagination,
  Loader,
  EmptyState,
  Alert,
} from "../../components/ui";

function DoctorTable({
  doctors,
  loading,
  error,
  pagination,
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  departmentsList = [],
  onPageChange,
  onRefresh,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const tableHeaders = [
    { label: "Doctor" },
    { label: "Contact Info" },
    { label: "Department" },
    { label: "Specialization" },
    { label: "Experience" },
    { label: "Fee" },
    { label: "Status" },
    { label: "Actions", className: "text-end" },
  ];

  const hasActiveFilters = search !== "" || department !== "";

  const clearFilters = () => {
    onSearchChange("");
    onDepartmentChange("");
  };

  return (
    <div className="staff-list-page">
      <PageHeader
        title="Doctors"
        subtitle="Manage all hospital doctors, credentials, and schedule availability"
        actionText="Add Doctor"
        actionIcon="plus-lg"
        onActionClick={onAdd}
      />

      {error && <Alert variant="danger" onClose={onRefresh}>{error}</Alert>}

      <Card className="staff-search-card">
        <div className="card-body">
          <div className="row g-4 align-items-center">
            <div className="col-md-5 col-12">
              <SearchBar
                value={search}
                onChange={onSearchChange}
                placeholder="Search by doctor name, email, or specialization..."
              />
            </div>
            <div className="col-md-7 col-12">
              <Filters showClear={hasActiveFilters} onClear={clearFilters}>
                <select
                  className="form-select staff-filter-select"
                  value={department}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departmentsList.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </Filters>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <Loader text="Fetching doctors records..." />
        </Card>
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No Doctors Found"
          description={
            hasActiveFilters
              ? "No doctor matching your filter criteria was found."
              : "Start by adding the first doctor to the system."
          }
          icon="person-badge"
          actionText={hasActiveFilters ? "Clear Filters" : "Add Doctor"}
          onActionClick={hasActiveFilters ? clearFilters : onAdd}
        />
      ) : (
        <Card className="staff-table-card">
          <Table headers={tableHeaders}>
            {doctors.map((doctor) => {
              const docId = doctor.doctorId || doctor._id;
              const initials = (doctor.fullName || "D")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <tr key={docId}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {doctor.profilePhoto ? (
                        <img
                          src={doctor.profilePhoto}
                          alt={doctor.fullName}
                          className="rounded-circle object-fit-cover"
                          style={{ width: "40px", height: "40px" }}
                        />
                      ) : (
                        <div className="user-avatar-circle">{initials}</div>
                      )}
                      <div>
                        <h6 className="mb-0 fw-semibold text-dark">{doctor.fullName}</h6>
                        <span className="text-muted small">{doctor.qualification || "MD"}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small">
                      <div className="text-dark"><i className="bi bi-envelope me-1 text-muted"></i>{doctor.email}</div>
                      <div className="text-muted"><i className="bi bi-telephone me-1 text-muted"></i>{doctor.phone}</div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="primary">{doctor.department || "General"}</Badge>
                  </td>
                  <td>
                    <span className="fw-medium text-dark">{doctor.specialization || "N/A"}</span>
                  </td>
                  <td>
                    <span className="text-dark">{doctor.experience ? `${doctor.experience} Yrs` : "N/A"}</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-dark">₹{doctor.consultationFee || 0}</span>
                  </td>
                  <td>
                    <Badge variant={doctor.isAvailable !== false ? "success" : "danger"} showDot>
                      {doctor.isAvailable !== false ? "Available" : "Unavailable"}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <div className="action-buttons justify-content-end">
                      <Button
                        variant="soft-primary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onView(doctor)}
                        title="View Details"
                      >
                        <i className="bi bi-eye fs-6"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onEdit(doctor)}
                        title="Edit Doctor"
                      >
                        <i className="bi bi-pencil fs-6"></i>
                      </Button>
                      <Button
                        variant="soft-danger"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onDelete(doctor)}
                        title="Delete Doctor"
                      >
                        <i className="bi bi-trash fs-6"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>

          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </Card>
      )}
    </div>
  );
}

export default DoctorTable;
