function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  optionLabel = "name",
  optionValue = "_id",
}) {
  return (
    <div className="form-group">

      {label && (
        <label className="field-label">
          {label}
        </label>
      )}

      <select
        className="select"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">
          Select
        </option>

        {options.map((item) => (
          <option
            key={item[optionValue]}
            value={item[optionValue]}
          >
            {item[optionLabel]}
          </option>
        ))}
      </select>

    </div>
  );
}

export default Select;