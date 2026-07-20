export function Button({
  children,
  className = "",
  icon,
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      type={type}
      {...props}
    >
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  padded = true,
  as: Element = "section",
  ...props
}) {
  return (
    <Element
      className={`card ${padded ? "card-padding" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Element>
  );
}

export function Avatar({
  alt = "",
  className = "",
  initials = "",
  size = 40,
  src,
}) {
  return (
    <span
      className={`avatar ${className}`.trim()}
      style={{ width: size, height: size, minWidth: size }}
    >
      {src ? <img src={src} alt={alt} /> : initials}
    </span>
  );
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Input({ label, className = "", ...props }) {
  return (
    <label>
      {label && <span className="field-label">{label}</span>}
      <input className={`input ${className}`.trim()} {...props} />
    </label>
  );
}

export function TextArea({ label, className = "", ...props }) {
  return (
    <label>
      {label && <span className="field-label">{label}</span>}
      <textarea className={`textarea ${className}`.trim()} {...props} />
    </label>
  );
}

export function ProgressBar({ className = "", value }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
    >
      <div
        className={`progress-fill ${className}`.trim()}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Table({ columns, data, renderRow }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>{renderRow(item)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
