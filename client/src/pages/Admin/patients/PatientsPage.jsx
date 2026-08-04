import { useCallback, useEffect, useState } from "react";

import AdminLayout from "../../../layouts/AdminLayout";

import PatientTable from "./components/PatientTable";
import PatientDetails from "./components/PatientDetails";
import DeletePatientModal from "./components/DeletePatientModal";

import {
  getPatients,
  getPatientById,
} from "../../../services/adminPatientService";

import { getApiErrorMessage } from "../../../services/api";

import { PageContainer } from "../components/ui";

function PatientsContent() {
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [mode, setMode] = useState("table");
  // table | view | delete

  // --------------------------------------------------
  // Fetch Patients
  // --------------------------------------------------

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPatients({
        page,
        limit: 10,
        search,
      });

      const list = response.data || response.patients || [];

      setPatients(list);

      setPagination(
        response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: list.length,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        },
      );
    } catch (err) {
      console.error("Failed to load patients:", err);

      setError(getApiErrorMessage(err, "Failed to load patients."));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // --------------------------------------------------
  // Load patients whenever page/search changes
  // --------------------------------------------------

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  // --------------------------------------------------
  // View Patient
  // --------------------------------------------------

  const handleView = async (patient) => {
    try {
      setLoading(true);
      setError("");

      const patientId = patient._id || patient.patientId;

      const response = await getPatientById(patientId);

      setSelectedPatient(response.patient || patient);

      setMode("view");
    } catch (err) {
      console.error("Failed to load patient:", err);

      setError(getApiErrorMessage(err, "Failed to load patient details."));
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Back to Table
  // --------------------------------------------------

  const handleBack = () => {
    setSelectedPatient(null);
    setMode("table");
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <PageContainer>
      {mode === "table" && (
        <PatientTable
          patients={patients}
          loading={loading}
          error={error}
          pagination={pagination}
          search={search}
          onSearchChange={handleSearchChange}
          onPageChange={setPage}
          onRefresh={fetchPatients}
          onView={handleView}
          onDelete={(patient) => {
            setSelectedPatient(patient);
            setMode("delete");
          }}
        />
      )}

      {mode === "view" && (
        <PatientDetails
          patient={selectedPatient}
          onBack={handleBack}
          onDelete={() => setMode("delete")}
        />
      )}
      {mode === "delete" && (
        <DeletePatientModal
          patient={selectedPatient}
          onClose={() => {
            setSelectedPatient(null);
            setMode("table");
          }}
          onDeleted={() => {
            setSelectedPatient(null);
            setMode("table");
            fetchPatients();
          }}
        />
      )}
    </PageContainer>
  );
}

function PatientsPage() {
  return (
    <AdminLayout>
      <PatientsContent />
    </AdminLayout>
  );
}

export default PatientsPage;
