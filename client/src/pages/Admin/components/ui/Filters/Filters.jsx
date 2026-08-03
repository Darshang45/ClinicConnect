import React from "react";

function Filters({ children, onClear, showClear = false }) {
  return (
    <div className="d-flex flex-wrap align-items-center gap-2 staff-filters">
      {children}
      {showClear && onClear && (
        <button
          type="button"
          className="btn btn-soft-danger btn-sm"
          onClick={onClear}
        >
          <i className="bi bi-x-circle me-1"></i> Clear Filters
        </button>
      )}
    </div>
  );
}

export default Filters;
