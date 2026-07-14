function Container({ children, className = "", ...props }) {
  return (
    <div className={`pd-container ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default Container;
