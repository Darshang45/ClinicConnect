import { useState } from "react";

import DeleteModal from "../../components/ui/Modal/DeleteModal";

import { deletePatient } from "../../../../services/adminPatientService";

function DeletePatientModal({
  patient,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);

  if (!patient) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deletePatient(patient._id);

      onDeleted();

    } catch (error) {
      console.error(
        "Delete patient error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete patient."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteModal
      isOpen={true}
      title="Delete Patient"
      itemName={patient.fullName}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
}

export default DeletePatientModal;