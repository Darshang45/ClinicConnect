import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import DoctorTable from "./components/DoctorTable";
import DoctorForm from "./components/DoctorForm";
import DoctorDetails from "./components/DoctorDetails";
import DeleteDoctorModal from "./components/DeleteDoctorModal";
import { DoctorProvider } from "../../../context/DoctorContext";
import { getDoctors, getDepartments } from "../../../services/AdminDoctorService";
import { PageContainer } from "../components/ui";

function DoctorsContent() {
  const [mode, setMode] = useState("table"); // 'table' | 'add' | 'edit' | 'view' | 'delete'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);

  // Load departments list for filtering
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        setDepartmentsList(res.departments || []);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };
    fetchDepts();
  }, []);

  const fetchDoctorsList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getDoctors({
        page,
        limit: 10,
        search,
      });

      let filteredDoctors = response.data || [];

      // Frontend filter by department if set
      if (department) {
        filteredDoctors = filteredDoctors.filter(
          (doc) => doc.departmentId === department || doc.department === department
        );
      }

      setDoctors(filteredDoctors);
      setPagination(response.pagination || {
        currentPage: page,
        totalPages: Math.ceil(filteredDoctors.length / 10) || 1,
        totalItems: filteredDoctors.length,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load doctors list.");
    } finally {
      setLoading(false);
    }
  }, [page, search, department]);

  useEffect(() => {
    fetchDoctorsList();
  }, [fetchDoctorsList]);

  return (
    <PageContainer>
      {mode === "table" && (
        <DoctorTable
          doctors={doctors}
          loading={loading}
          error={error}
          pagination={pagination}
          search={search}
          onSearchChange={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          departmentsList={departmentsList}
          onPageChange={setPage}
          onRefresh={fetchDoctorsList}
          onAdd={() => setMode("add")}
          onView={(doctor) => {
            setSelectedDoctor(doctor);
            setMode("view");
          }}
          onEdit={(doctor) => {
            setSelectedDoctor(doctor);
            setMode("edit");
          }}
          onDelete={(doctor) => {
            setSelectedDoctor(doctor);
            setMode("delete");
          }}
        />
      )}

      {mode === "add" && (
        <DoctorForm
          mode="add"
          onCancel={() => setMode("table")}
          onSuccess={() => {
            fetchDoctorsList();
            setMode("table");
          }}
        />
      )}

      {mode === "edit" && (
        <DoctorForm
          mode="edit"
          doctor={selectedDoctor}
          onCancel={() => setMode("table")}
          onSuccess={() => {
            fetchDoctorsList();
            setMode("table");
          }}
        />
      )}

      {mode === "view" && (
        <DoctorDetails
          doctor={selectedDoctor}
          onBack={() => setMode("table")}
          onEdit={() => setMode("edit")}
          onDelete={() => setMode("delete")}
        />
      )}

      {mode === "delete" && (
        <DeleteDoctorModal
          doctor={selectedDoctor}
          onClose={() => setMode("table")}
          onSuccess={() => {
            fetchDoctorsList();
            setMode("table");
          }}
        />
      )}
    </PageContainer>
  );
}

function DoctorsPage() {
  return (
    <AdminLayout>
      <DoctorProvider>
        <DoctorsContent />
      </DoctorProvider>
    </AdminLayout>
  );
}

export default DoctorsPage;
