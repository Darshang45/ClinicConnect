import React from "react";
import Modal from "./Modal";
import Button from "../Button/Button";

function DeleteModal({
  isOpen = true,
  title = "Confirm Delete",
  itemName = "item",
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            <i className="bi bi-trash me-1"></i> Delete
          </Button>
        </>
      }
    >
      <div className="delete-modal-content">
        <div className="delete-modal-icon">
          <i className="bi bi-exclamation-triangle-fill fs-2"></i>
        </div>
        <h6>Are you sure?</h6>
        <p>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}

export default DeleteModal;
