import "../../styles/doctor_dashboard.css";
import "../../styles/patient_dashboard.css";

function Button({
  children,
  className = "",
  type = "button",
  variant = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`doc-button ${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;