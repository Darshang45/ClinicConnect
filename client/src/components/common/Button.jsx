import "../../styles/reception_dashboard.css";

function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button className={`rc-button ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;
