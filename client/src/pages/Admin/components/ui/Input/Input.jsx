function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {
  return (
    <div className="form-group">

      {label && (
        <label className="field-label">
          {label}
        </label>
      )}

      <input
        className="input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />

    </div>
  );
}

export default Input;