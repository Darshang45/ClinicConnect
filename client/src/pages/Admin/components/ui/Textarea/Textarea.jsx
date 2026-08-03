function TextArea({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="form-group form-group-full">

      <label className="field-label">
        {label}
      </label>

      <textarea
        className="textarea"
        rows={4}
        name={name}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}

export default TextArea;