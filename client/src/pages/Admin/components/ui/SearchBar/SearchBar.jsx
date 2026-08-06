import React from "react";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="input-group staff-search-input">
      <span className="input-group-text bg-white border-end-0">
        <i className="bi bi-search text-muted"></i>
      </span>
      <input
        type="text"
        className="form-control border-start-0 ps-0 shadow-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn btn-outline-secondary border-start-0"
          type="button"
          onClick={() => onChange("")}
        >
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
