import React from "react";

export function FormGroup({ children, className = "", colSpan = 1 }) {
  const colClass = colSpan === 2 ? "col-12" : "col-md-6 col-12";
  return <div className={`${colClass} mb-3 staff-form-group ${className}`.trim()}>{children}</div>;
}

export function FormLabel({ children, required = false, htmlFor = "" }) {
  return (
    <label htmlFor={htmlFor} className="form-label staff-form-label">
      {children}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
  );
}

export function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  className = "",
  id,
}) {
  return (
    <div>
      <input
        id={id || name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-control staff-form-control ${error ? "is-invalid" : ""} ${className}`.trim()}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select Option",
  required = false,
  disabled = false,
  error = "",
  className = "",
  id,
}) {
  return (
    <div>
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select staff-form-select ${error ? "is-invalid" : ""} ${className}`.trim()}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export function Textarea({
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  disabled = false,
  error = "",
  className = "",
  id,
}) {
  return (
    <div>
      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`form-control staff-form-control staff-textarea ${error ? "is-invalid" : ""} ${className}`.trim()}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export function ValidationError({ message }) {
  if (!message) return null;
  return <div className="text-danger small mt-1">{message}</div>;
}
