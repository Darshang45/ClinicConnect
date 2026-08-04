import { useState } from "react";
import DeleteModal from "../../components/ui/Modal/DeleteModal";
import { deleteDepartment } from "../../../../services/adminDepartmentService";

function DeleteDepartmentModal({ department, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!department) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteDepartment(department._id);

      alert("Department deleted successfully.");

      onDeleted();
    } catch (error) {
      console.error("Delete department error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete department."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteModal
      isOpen={true}
      title="Delete Department"
      itemName={department.name}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
}

export default DeleteDepartmentModal;