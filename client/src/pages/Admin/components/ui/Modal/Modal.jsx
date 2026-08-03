import React, { useEffect } from "react";

function Modal({ isOpen, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className={`modal-dialog-custom staff-modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header-custom">
          <h5 className="modal-title">{title}</h5>
          {onClose && (
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          )}
        </div>
        <div className="modal-body-custom">{children}</div>
        {footer && <div className="modal-footer-custom">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
