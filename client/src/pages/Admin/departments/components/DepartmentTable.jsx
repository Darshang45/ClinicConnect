import Button from "../../components/ui/Button/Button";
import Badge from "../../components/ui/Badge/Badge";
import Card from "../../components/ui/Card/Card";
import Pagination from "../../components/ui/Pagination/Pagination";

function DepartmentTable({
  departments = [],
  loading,
  pagination,
  onPageChange,
  onAdd,
  onView,
  onEdit,
  onDelete,
  search = "",
  onSearchChange,
  refreshKey,
}) {
  const filteredDepartments = departments.filter((department) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      department.name?.toLowerCase().includes(value) ||
      department.code?.toLowerCase().includes(value) ||
      department.description?.toLowerCase().includes(value)
    );
  });

  return (
    <Card
      title="Departments"
      subtitle="Manage hospital departments"
      headerAction={
        <Button
          icon="plus-lg"
          onClick={onAdd}
        >
          Add Department
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-2 text-muted">
            Loading departments...
          </p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        /* Empty state */
        <div className="text-center py-5">
          <p className="text-muted mb-0">
            No departments found.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department) => (
                  <tr key={department._id}>
                    <td>
                      <strong>
                        {department.name}
                      </strong>
                    </td>

                    <td>
                      {department.code}
                    </td>

                    <td>
                      {department.description || "-"}
                    </td>

                    <td>
                      {department.consultationDuration} min
                    </td>

                    <td>
                      ₹{department.consultationFee}
                    </td>

                    <td>
                      <Badge
                        variant={
                          department.isActive
                            ? "success"
                            : "danger"
                        }
                      >
                        {department.isActive
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onView(department)
                          }
                        >
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onEdit(department)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            onDelete(department)
                          }
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

          {/* Pagination */}
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Card>
  );
}

export default DepartmentTable;