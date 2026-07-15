import "../../styles/reception_dashboard.css";

function Container({ as: Component = "div", children, className = "" }) {
  return <Component className={`rc-container ${className}`.trim()}>{children}</Component>;
}

export default Container;
