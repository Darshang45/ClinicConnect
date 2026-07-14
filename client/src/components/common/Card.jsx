import "../../styles/doctor_dashboard.css";

function Card({ children, className = "", as: Component = "div" }) {
  return <Component className={`doc-card ${className}`.trim()}>{children}</Component>;
}

export default Card;
