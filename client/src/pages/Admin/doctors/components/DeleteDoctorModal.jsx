import React, { useState } from "react";
import { deleteDoctor } from "../../../../services/AdminDoctorService";
import { getApiErrorMessage } from "../../../../services/api";
import { DeleteModal } from "../../components/ui";

function DeleteDoctorModal({ doctor, onClose, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!doctor) return;
    try {
      setLoading(true);
      const docId = doctor.doctorId || doctor._id;
      const response = await deleteDoctor(docId);
      if (onSuccess) onSuccess(response?.message);
    } catch (error) {
      console.error(error);
      if (onError) onError(getApiErrorMessage(error, "Unable to delete doctor."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteModal
      isOpen={true}
      title="Delete Doctor Account"
      itemName={doctor?.fullName || "Doctor"}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
}

export default DeleteDoctorModal;
