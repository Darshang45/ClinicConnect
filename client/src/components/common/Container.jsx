function Container({ as: Component = "div", children, className = "", ...props }) {
  return (
    <Component className={`common-container ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Container;
