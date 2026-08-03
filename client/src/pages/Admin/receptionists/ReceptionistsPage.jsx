import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import ReceptionistTable from "./components/ReceptionistTable";
import ReceptionistForm from "./components/ReceptionistForm";
import ReceptionistDetails from "./components/ReceptionistDetails";
import DeleteReceptionistModal from "./components/DeleteReceptionistModal";
import { getReceptionists } from "../../../services/AdminReceptionistService";
import { PageContainer } from "../components/ui";

function ReceptionistsPage() {
  const [mode, setMode] = useState("table"); // 'table' | 'add' | 'edit' | 'view' | 'delete'
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      setError(err.response?.data?.message || "Failed to load receptionists list.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchReceptionistsList();
  }, [fetchReceptionistsList]);

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
            onSearchChange={setSearch}
            onPageChange={setPage}
            onRefresh={fetchReceptionistsList}
            onAdd={() => setMode("add")}
            onView={(rec) => {
              setSelectedReceptionist(rec);
              setMode("view");
            }}
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
            onSuccess={() => {
              fetchReceptionistsList();
              setMode("table");
            }}
          />
        )}

        {mode === "edit" && (
          <ReceptionistForm
            mode="edit"
            receptionist={selectedReceptionist}
            onCancel={() => setMode("table")}
            onSuccess={() => {
              fetchReceptionistsList();
              setMode("table");
            }}
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
            onSuccess={() => {
              fetchReceptionistsList();
              setMode("table");
            }}
          />
        )}
      </PageContainer>
    </AdminLayout>
  );
}

export default ReceptionistsPage;
