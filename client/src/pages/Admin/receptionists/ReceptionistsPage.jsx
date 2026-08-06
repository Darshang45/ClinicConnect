import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import ReceptionistTable from "./components/ReceptionistTable";
import ReceptionistForm from "./components/ReceptionistForm";
import ReceptionistDetails from "./components/ReceptionistDetails";
import DeleteReceptionistModal from "./components/DeleteReceptionistModal";
import { getReceptionists, getReceptionistById } from "../../../services/AdminReceptionistService";
import { getApiErrorMessage } from "../../../services/api";
import { PageContainer } from "../components/ui";

function ReceptionistsPage() {
  const [mode, setMode] = useState("table"); // 'table' | 'add' | 'edit' | 'view' | 'delete'
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");

  const fetchReceptionistsList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getReceptionists({
        page,
        limit: 10,
        search,
      });

      const list = response.data || response.receptionists || [];
      setReceptionists(list);
      setPagination(
        response.pagination || {
          currentPage: page,
          totalPages: Math.ceil(list.length / 10) || 1,
          totalItems: list.length,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        }
      );
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load receptionists list."));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchReceptionistsList();
  }, [fetchReceptionistsList]);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleView = async (receptionist) => {
    try {
      setLoading(true);
      setError("");
      const receptionistId = receptionist._id || receptionist.id;
      const response = await getReceptionistById(receptionistId);
      setSelectedReceptionist({ ...receptionist, ...(response.receptionist || {}) });
      setMode("view");
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load receptionist details."));
    } finally {
      setLoading(false);
    }
  };

  const handleMutationSuccess = (message) => {
    setError("");
    setSuccess(message || "Receptionist record saved successfully.");
    setMode("table");
    fetchReceptionistsList();
  };

  const handleMutationError = (message) => {
    setSuccess("");
    setError(message || "Unable to complete the receptionist request.");
    setMode("table");
  };

  return (
    <AdminLayout>
      <PageContainer>
        {mode === "table" && (
          <ReceptionistTable
            receptionists={receptionists}
            loading={loading}
            error={error}
            pagination={pagination}
            search={search}
            onSearchChange={handleSearchChange}
            onPageChange={setPage}
            onRefresh={fetchReceptionistsList}
            success={success}
            onSuccessClose={() => setSuccess("")}
            onAdd={() => {
              setSuccess("");
              setMode("add");
            }}
            onView={handleView}
            onEdit={(rec) => {
              setSelectedReceptionist(rec);
              setMode("edit");
            }}
            onDelete={(rec) => {
              setSelectedReceptionist(rec);
              setMode("delete");
            }}
          />
        )}

        {mode === "add" && (
          <ReceptionistForm
            mode="add"
            onCancel={() => setMode("table")}
            onSuccess={handleMutationSuccess}
          />
        )}

        {mode === "edit" && (
          <ReceptionistForm
            mode="edit"
            receptionist={selectedReceptionist}
            onCancel={() => setMode("table")}
            onSuccess={handleMutationSuccess}
          />
        )}

        {mode === "view" && (
          <ReceptionistDetails
            receptionist={selectedReceptionist}
            onBack={() => setMode("table")}
            onEdit={() => setMode("edit")}
            onDelete={() => setMode("delete")}
          />
        )}

        {mode === "delete" && (
          <DeleteReceptionistModal
            receptionist={selectedReceptionist}
            onClose={() => setMode("table")}
            onSuccess={handleMutationSuccess}
            onError={handleMutationError}
          />
        )}
      </PageContainer>
    </AdminLayout>
  );
}

export default ReceptionistsPage;
