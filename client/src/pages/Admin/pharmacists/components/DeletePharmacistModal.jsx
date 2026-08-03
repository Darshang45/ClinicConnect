import React, { useState } from "react";
import { deletePharmacist } from "../../../../services/AdminPharmacistService";
import { getApiErrorMessage } from "../../../../services/api";
import { DeleteModal } from "../../components/ui";

function DeletePharmacistModal({ pharmacist, onClose, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!pharmacist) return;
    try {
      setLoading(true);
      const pharmId = pharmacist._id || pharmacist.id;
      const response = await deletePharmacist(pharmId);
      if (onSuccess) onSuccess(response?.message);
    } catch (error) {
      console.error(error);
      if (onError) onError(getApiErrorMessage(error, "Unable to delete pharmacist."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteModal
      isOpen={true}
      title="Delete Pharmacist Account"
      itemName={pharmacist?.fullName || "Pharmacist"}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
}

export default DeletePharmacistModal;
