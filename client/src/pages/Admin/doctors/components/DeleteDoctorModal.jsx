import React, { useState } from "react";
import { deleteDoctor } from "../../../../services/AdminDoctorService";
import { DeleteModal } from "../../components/ui";

function DeleteDoctorModal({ doctor, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!doctor) return;
    try {
      setLoading(true);
      const docId = doctor.doctorId || doctor._id;
      await deleteDoctor(docId);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to delete doctor.");
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