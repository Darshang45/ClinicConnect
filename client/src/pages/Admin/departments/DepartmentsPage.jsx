import { useEffect, useState } from "react";
import {
  getDepartments,
} from "../../../services/adminDepartmentService";

import DepartmentTable from "./components/DepartmentTable";
import DepartmentForm from "./components/DepartmentForm";
import DepartmentDetails from "./components/DepartmentDetails";
import DeleteDepartmentModal from "./components/DeleteDepartmentModal";

import AdminLayout from "../../../layouts/AdminLayout";
import { PageContainer } from "../components/ui";

function DepartmentsContent() {
  const [mode, setMode] = useState("table");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch departments
  const fetchDepartments = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getDepartments({
        page,
        limit: 10,
      });

      setDepartments(response.data || []);

      setPagination(
        response.pagination || {
          currentPage: page,
          limit: 10,
          totalPages: 1,
          totalRecords: response.data?.length || 0,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        }
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDepartments(1);
  }, []);

  // Delete department
const handleDeleteSuccess = async () => {
  setSelectedDepartment(null);
  setMode("table");

  await fetchDepartments(pagination.currentPage);
};

  return (
    <PageContainer>
      {/* =========================
          TABLE VIEW
      ========================= */}
      {mode === "table" && (
        <DepartmentTable
          departments={departments}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          pagination={pagination}
          onPageChange={fetchDepartments}
          onAdd={() => {
            setSelectedDepartment(null);
            setMode("add");
          }}
          onView={(department) => {
            setSelectedDepartment(department);
            setMode("view");
          }}
          onEdit={(department) => {
            setSelectedDepartment(department);
            setMode("edit");
          }}
          onDelete={(department) => {
            setSelectedDepartment(department);
            setMode("delete");
          }}
        />
      )}

      {/* =========================
          ADD / EDIT FORM
      ========================= */}
      {(mode === "add" || mode === "edit") && (
        <DepartmentForm
          mode={mode}
          department={selectedDepartment}
          onCancel={() => {
            setMode("table");
            setSelectedDepartment(null);
          }}
          onSuccess={() => {
            setMode("table");
            setSelectedDepartment(null);

            // Reload from first page
            fetchDepartments(1);
          }}
        />
      )}

      {/* =========================
          VIEW DETAILS
      ========================= */}
      {mode === "view" && (
        <DepartmentDetails
          department={selectedDepartment}
          onBack={() => {
            setMode("table");
            setSelectedDepartment(null);
          }}
          onEdit={(department) => {
            setSelectedDepartment(department);
            setMode("edit");
          }}
        />
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}
      {mode === "delete" && (
        <DeleteDepartmentModal
          department={selectedDepartment}
          onClose={() => {
            setSelectedDepartment(null);
            setMode("table");
          }}
          onDeleted={handleDeleteSuccess}
          loading={deleteLoading}
        />
      )}
    </PageContainer>
  );
}

function DepartmentsPage() {
  return (
    <AdminLayout>
      <DepartmentsContent />
    </AdminLayout>
  );
}

export default DepartmentsPage;