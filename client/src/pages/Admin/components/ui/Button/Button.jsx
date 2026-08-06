import React from "react";

function Button({
  children,
  variant = "primary",
  size = "",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  icon = "",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn staff-button btn-${variant} ${size ? `btn-${size}` : ""} ${className}`.trim()}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <i className={`bi bi-${icon}`}></i>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
