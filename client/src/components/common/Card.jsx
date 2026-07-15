import "../../styles/reception_dashboard.css";

function Card({ children, className = "" }) {
  return <div className={`rc-card ${className}`.trim()}>{children}</div>;
}

export default Card;
