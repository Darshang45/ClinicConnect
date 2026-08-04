import React, { useState } from "react";
import { deleteReceptionist } from "../../../../services/AdminReceptionistService";
import { getApiErrorMessage } from "../../../../services/api";
import { DeleteModal } from "../../components/ui";

function DeleteReceptionistModal({ receptionist, onClose, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!receptionist) return;
    try {
      setLoading(true);
      const recId = receptionist._id || receptionist.id;
      const response = await deleteReceptionist(recId);
      if (onSuccess) onSuccess(response?.message);
    } catch (error) {
      console.error(error);
      if (onError) onError(getApiErrorMessage(error, "Unable to delete receptionist."));
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
