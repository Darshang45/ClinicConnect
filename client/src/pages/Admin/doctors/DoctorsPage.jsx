import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import DoctorTable from "./components/DoctorTable";
import DoctorForm from "./components/DoctorForm";
import DoctorDetails from "./components/DoctorDetails";
import DeleteDoctorModal from "./components/DeleteDoctorModal";
import { DoctorProvider } from "../../../context/DoctorContext";
import { getDoctors, getDepartments, getDoctorById } from "../../../services/AdminDoctorService";
import { getApiErrorMessage } from "../../../services/api";
import { PageContainer } from "../components/ui";

function DoctorsContent() {
  const [mode, setMode] = useState("table"); // 'table' | 'add' | 'edit' | 'view' | 'delete'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
        department,
      });

      const list = response.data || response.doctors || [];

      setDoctors(list);
      setPagination(response.pagination || {
        currentPage: page,
        totalPages: Math.ceil(list.length / 10) || 1,
        totalItems: list.length,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load doctors list."));
    } finally {
      setLoading(false);
    }
  }, [page, search, department]);

  useEffect(() => {
    fetchDoctorsList();
  }, [fetchDoctorsList]);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleDepartmentChange = (value) => {
    setPage(1);
    setDepartment(value);
  };

  const handleView = async (doctor) => {
    try {
      setLoading(true);
      setError("");
      const doctorId = doctor.doctorId || doctor._id;
      const response = await getDoctorById(doctorId);
      setSelectedDoctor({ ...doctor, ...(response.doctor || {}) });
      setMode("view");
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load doctor details."));
    } finally {
      setLoading(false);
    }
  };

  const handleMutationSuccess = (message) => {
    setError("");
    setSuccess(message || "Doctor record saved successfully.");
    setMode("table");
    fetchDoctorsList();
  };

  const handleMutationError = (message) => {
    setSuccess("");
    setError(message || "Unable to complete the doctor request.");
    setMode("table");
  };

  return (
    <PageContainer>
      {mode === "table" && (
        <DoctorTable
          doctors={doctors}
          loading={loading}
          error={error}
          pagination={pagination}
          search={search}
          onSearchChange={handleSearchChange}
          department={department}
          onDepartmentChange={handleDepartmentChange}
          departmentsList={departmentsList}
          onPageChange={setPage}
          onRefresh={fetchDoctorsList}
          success={success}
          onSuccessClose={() => setSuccess("")}
          onAdd={() => {
            setSuccess("");
            setMode("add");
          }}
          onView={handleView}
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
          onSuccess={handleMutationSuccess}
        />
      )}

      {mode === "edit" && (
        <DoctorForm
          mode="edit"
          doctor={selectedDoctor}
          onCancel={() => setMode("table")}
          onSuccess={handleMutationSuccess}
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
          onSuccess={handleMutationSuccess}
          onError={handleMutationError}
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
