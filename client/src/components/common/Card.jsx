function Card({ as: Component = "div", children, className = "", ...props }) {
  return (
    <Component className={`common-card ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Card;
