import React, { useState } from "react";
import { deleteReceptionist } from "../../../../services/AdminReceptionistService";
import { DeleteModal } from "../../components/ui";

function DeleteReceptionistModal({ receptionist, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!receptionist) return;
    try {
      setLoading(true);
      const recId = receptionist._id || receptionist.id;
      await deleteReceptionist(recId);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to delete receptionist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteModal
      isOpen={true}
      title="Delete Receptionist Account"
      itemName={receptionist?.fullName || "Receptionist"}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
}

export default DeleteReceptionistModal;
