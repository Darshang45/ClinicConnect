import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import PharmacistTable from "./components/PharmacistTable";
import PharmacistForm from "./components/PharmacistForm";
import PharmacistDetails from "./components/PharmacistDetails";
import DeletePharmacistModal from "./components/DeletePharmacistModal";
import { getPharmacists, getPharmacistById } from "../../../services/AdminPharmacistService";
import { getApiErrorMessage } from "../../../services/api";
import { PageContainer } from "../components/ui";

function PharmacistsPage() {
  const [mode, setMode] = useState("table"); // 'table' | 'add' | 'edit' | 'view' | 'delete'
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");

  const fetchPharmacistsList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPharmacists({
        page,
        limit: 10,
        search,
      });

      const list = response.data || response.pharmacists || [];
      setPharmacists(list);
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
      setError(getApiErrorMessage(err, "Failed to load pharmacists list."));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPharmacistsList();
  }, [fetchPharmacistsList]);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleView = async (pharmacist) => {
    try {
      setLoading(true);
      setError("");
      const pharmacistId = pharmacist._id || pharmacist.id;
      const response = await getPharmacistById(pharmacistId);
      setSelectedPharmacist({ ...pharmacist, ...(response.pharmacist || {}) });
      setMode("view");
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Failed to load pharmacist details."));
    } finally {
      setLoading(false);
    }
  };

  const handleMutationSuccess = (message) => {
    setError("");
    setSuccess(message || "Pharmacist record saved successfully.");
    setMode("table");
    fetchPharmacistsList();
  };

  const handleMutationError = (message) => {
    setSuccess("");
    setError(message || "Unable to complete the pharmacist request.");
    setMode("table");
  };

  return (
    <AdminLayout>
      <PageContainer>
        {mode === "table" && (
          <PharmacistTable
            pharmacists={pharmacists}
            loading={loading}
            error={error}
            pagination={pagination}
            search={search}
            onSearchChange={handleSearchChange}
            onPageChange={setPage}
            onRefresh={fetchPharmacistsList}
            success={success}
            onSuccessClose={() => setSuccess("")}
            onAdd={() => {
              setSuccess("");
              setMode("add");
            }}
            onView={handleView}
            onEdit={(pharm) => {
              setSelectedPharmacist(pharm);
              setMode("edit");
            }}
            onDelete={(pharm) => {
              setSelectedPharmacist(pharm);
              setMode("delete");
            }}
          />
        )}

        {mode === "add" && (
          <PharmacistForm
            mode="add"
            onCancel={() => setMode("table")}
            onSuccess={handleMutationSuccess}
          />
        )}

        {mode === "edit" && (
          <PharmacistForm
            mode="edit"
            pharmacist={selectedPharmacist}
            onCancel={() => setMode("table")}
            onSuccess={handleMutationSuccess}
          />
        )}

        {mode === "view" && (
          <PharmacistDetails
            pharmacist={selectedPharmacist}
            onBack={() => setMode("table")}
            onEdit={() => setMode("edit")}
            onDelete={() => setMode("delete")}
          />
        )}

        {mode === "delete" && (
          <DeletePharmacistModal
            pharmacist={selectedPharmacist}
            onClose={() => setMode("table")}
            onSuccess={handleMutationSuccess}
            onError={handleMutationError}
          />
        )}
      </PageContainer>
    </AdminLayout>
  );
}

export default PharmacistsPage;
