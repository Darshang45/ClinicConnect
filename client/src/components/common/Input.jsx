function Input({
  as: Component = "input",
  children,
  className = "",
  id,
  label,
  name,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={className}>
      {label && <label htmlFor={inputId}>{label}</label>}
      {Component === "input"
        ? <input id={inputId} name={name} {...props} />
        : <Component id={inputId} name={name} {...props}>{children}</Component>}
    </div>
  );
}

export default Input;
