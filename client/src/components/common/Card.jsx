function Card({ children, className = "", ...props }) {
  return (
    <section className={`pd-card ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

export default Card;
