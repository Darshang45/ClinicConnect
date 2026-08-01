function Modal({ children, className = "", isOpen, onClose, overlayClassName = "", title }) {
  if (!isOpen) return null;

  return (
    <div
      className={`common-modal-backdrop ${overlayClassName}`.trim()}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className={`common-modal ${className}`.trim()} role="dialog" aria-modal="true" aria-label={title}>
        <header className="common-modal-header">
          <h2>{title}</h2>
          <button type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        </header>
        {children}
      </section>
    </div>
  );
}

export default Modal;
