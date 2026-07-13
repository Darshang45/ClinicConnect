function MobileMenu({ isOpen, onClose }) {
  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      onClose();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`mobile-drawer ${isOpen ? "mobile-drawer-open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`mobile-drawer-content ${isOpen ? "mobile-drawer-content-open" : ""}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-brand">LuxeHealth</span>
          <button type="button" onClick={onClose} aria-label="Close menu">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mobile-drawer-links">
          <a href="#" className="mobile-link-active" onClick={(e) => handleLinkClick(e, "#")}>
            Home
          </a>
          <a href="#about" onClick={(e) => handleLinkClick(e, "#about")}>
            About
          </a>
          <a href="#doctors" onClick={(e) => handleLinkClick(e, "#doctors")}>
            Doctors
          </a>
          <a href="#departments" onClick={(e) => handleLinkClick(e, "#departments")}>
            Departments
          </a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")}>
            Contact
          </a>
        </div>

        <div className="mobile-drawer-actions">
          <a href="#book" className="btn btn-primary mobile-drawer-btn" onClick={(e) => handleLinkClick(e, "#book")}>
            Book Appointment
          </a>
          <a href="#" className="btn btn-outline mobile-drawer-btn">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
