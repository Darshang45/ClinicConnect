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

function ReceptionistTable({
  receptionists = [],
  loading,
  error,
  pagination,
  search,
  onSearchChange,
  onPageChange,
  onRefresh,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const tableHeaders = [
    { label: "Receptionist" },
    { label: "Email" },
    { label: "Phone" },
    { label: "Role" },
    { label: "Status" },
    { label: "Actions", className: "text-end" },
  ];

  return (
    <div className="staff-list-page">
      <PageHeader
        title="Receptionists"
        subtitle="Manage hospital front-desk reception personnel, check-in desks, and accounts"
        actionText="Add Receptionist"
        actionIcon="plus-lg"
        onActionClick={onAdd}
      />

      {error && <Alert variant="danger" onClose={onRefresh}>{error}</Alert>}

      <Card className="staff-search-card">
        <div className="card-body">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 col-12">
              <SearchBar
                value={search}
                onChange={onSearchChange}
                placeholder="Search receptionist by name, email, or phone..."
              />
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <Loader text="Fetching receptionist records..." />
        </Card>
      ) : receptionists.length === 0 ? (
        <EmptyState
          title="No Receptionists Found"
          description={
            search
              ? "No receptionist matched your search term."
              : "Start by registering your first front-desk receptionist."
          }
          icon="support-agent"
          actionText={search ? "Clear Search" : "Add Receptionist"}
          onActionClick={search ? () => onSearchChange("") : onAdd}
        />
      ) : (
        <Card className="staff-table-card">
          <Table headers={tableHeaders}>
            {receptionists.map((rec) => {
              const recId = rec._id || rec.id;
              const initials = (rec.fullName || "R")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <tr key={recId}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="user-avatar-circle bg-primary">{initials}</div>
                      <div>
                        <h6 className="mb-0 fw-semibold text-dark">{rec.fullName}</h6>
                        <span className="text-muted small">Front Desk Staff</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark"><i className="bi bi-envelope me-1 text-muted"></i>{rec.email}</span>
                  </td>
                  <td>
                    <span className="text-dark"><i className="bi bi-telephone me-1 text-muted"></i>{rec.phone}</span>
                  </td>
                  <td>
                    <Badge variant="info">Receptionist</Badge>
                  </td>
                  <td>
                    <Badge variant={rec.isActive !== false ? "success" : "danger"} showDot>
                      {rec.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <div className="action-buttons justify-content-end">
                      <Button
                        variant="soft-primary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onView(rec)}
                        title="View Details"
                      >
                        <i className="bi bi-eye fs-6"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onEdit(rec)}
                        title="Edit Receptionist"
                      >
                        <i className="bi bi-pencil fs-6"></i>
                      </Button>
                      <Button
                        variant="soft-danger"
                        size="sm"
                        className="btn-icon"
                        onClick={() => onDelete(rec)}
                        title="Delete Receptionist"
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

export default ReceptionistTable;
