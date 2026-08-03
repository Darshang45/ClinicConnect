import React from "react";

function Badge({ children, variant = "primary", showDot = false, className = "" }) {
  return (
    <span className={`badge staff-badge badge-${variant} ${className}`.trim()}>
      {showDot && <span className="badge-dot"></span>}
      {children}
    </span>
  );
}

export default Badge;
