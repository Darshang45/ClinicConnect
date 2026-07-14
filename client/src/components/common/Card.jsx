import "../../styles/doctor_dashboard.css";
import "../../styles/patient_dashboard.css";

function Card({
  children,
  className = "",
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={`doc-card ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;