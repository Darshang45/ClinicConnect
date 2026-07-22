function Navbar({
  as: Component = "header",
  className = "",
  contentClassName = "",
  brand,
  navigation,
  actions,
  children,
  ...props
}) {
  const content = children ?? <>{brand}{navigation}{actions}</>;

  return (
    <Component className={className} {...props}>
      {contentClassName ? <div className={contentClassName}>{content}</div> : content}
    </Component>
  );
}

export default Navbar;
