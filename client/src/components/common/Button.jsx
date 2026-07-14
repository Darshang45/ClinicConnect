function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button className={`pd-button ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;