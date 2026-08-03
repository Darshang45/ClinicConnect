import React from "react";
import {
  PageHeader,
  Card,
  SearchBar,
  Table,
  Badge,
  Button,
  Pagination,
  Loader,
  EmptyState,
  Alert,
} from "../../components/ui";

function PharmacistTable({
  pharmacists = [],
  loading,
  error,
  success,
  pagination,
  search,
  onSearchChange,
  onPageChange,
  onRefresh,
  onSuccessClose,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const tableHeaders = [
    { label: "Pharmacist" },
    { label: "Email" },
    { label: "Phone" },
    { label: "Role" },
    { label: "Status" },
    { label: "Actions", className: "text-end" },
  ];

  return (
    <div className="staff-list-page">
      <PageHeader
        title="Pharmacists"
        subtitle="Manage hospital pharmacy staff, medicine inventory managers, and user credentials"
        actionText="Add Pharmacist"
        actionIcon="plus-lg"
        onActionClick={onAdd}
      />

      {error && <Alert variant="danger" onClose={onRefresh}>{error}</Alert>}
      {success && <Alert variant="success" onClose={onSuccessClose}>{success}</Alert>}

      <Card className="staff-search-card">
        <div className="card-body">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 col-12">
              <SearchBar
                value={search}
                onChange={onSearchChange}
                placeholder="Search pharmacist by name, email, or phone..."
              />
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <Loader text="Fetching pharmacist records..." />
        </Card>
      ) : pharmacists.length === 0 ? (
        <EmptyState
          title="No Pharmacists Found"
          description={
            search
              ? "No pharmacist matched your search term."
              : "Start by registering your first pharmacy staff member."
          }
          icon="capsule"
          actionText={search ? "Clear Search" : "Add Pharmacist"}
          onActionClick={search ? () => onSearchChange("") : onAdd}
        />
      ) : (
        <Card className="staff-table-card">
          <Table headers={tableHeaders}>
            {pharmacists.map((pharm) => {
              const pharmId = pharm._id || pharm.id;
              const initials = (pharm.fullName || "P")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <tr key={pharmId}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="user-avatar-circle bg-success">{initials}</div>
                      <div>
                        <h6 className="mb-0 fw-semibold text-dark">{pharm.fullName}</h6>
                        <span className="text-muted small">Pharmacy Manager</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark"><i className="bi bi-envelope me-1 text-muted"></i>{pharm.email}</span>
                  </td>
                  <td>
                    <span className="text-dark"><i className="bi bi-telephone me-1 text-muted"></i>{pharm.phone}</span>
                  </td>
                  <td>
                    <Badge variant="warning">Pharmacist</Badge>
                  </td>
                  <td>
                    <Badge variant={pharm.isActive !== false ? "success" : "danger"} showDot>
                      {pharm.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <div className="action-buttons justify-content-end">
                      <Button
                        variant="soft-primary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onView(pharm)}
                        title="View Details"
                      >
                        <i className="bi bi-eye fs-6"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onEdit(pharm)}
                        title="Edit Pharmacist"
                      >
                        <i className="bi bi-pencil fs-6"></i>
                      </Button>
                      <Button
                        variant="soft-danger"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onDelete(pharm)}
                        title="Delete Pharmacist"
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

export default PharmacistTable;
