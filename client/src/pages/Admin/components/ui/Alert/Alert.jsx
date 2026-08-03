import React from "react";

function Alert({ children, variant = "danger", onClose, className = "" }) {
  if (!children) return null;

  const getIcon = () => {
    switch (variant) {
      case "success": return "check-circle-fill";
      case "danger": return "exclamation-triangle-fill";
      case "warning": return "exclamation-circle-fill";
      default: return "info-circle-fill";
    }
  };

  return (
    <div className={`admin-alert admin-alert-${variant} ${className}`.trim()}>
      <div className="d-flex align-items-center gap-2">
        <i className={`bi bi-${getIcon()} fs-5`}></i>
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close shadow-none btn-sm"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
}

export default Alert;
