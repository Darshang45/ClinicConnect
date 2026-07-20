function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="material-symbols-outlined filled">local_hospital</span>
            <span>Clinic Connect</span>
          </div>
          <p>
            Clinic Connect is committed to providing premium healthcare through clinical excellence and
            compassionate service.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <span className="material-symbols-outlined">face_nod</span>
            </a>
            <a href="#" aria-label="Twitter">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a href="#" aria-label="Email">
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <a href="#">Find a Doctor</a>
          <a href="#">Patient Portal</a>
          <a href="#facilities">Facilities &amp; Services</a>
          <a href="#">Medical Records</a>
          <a href="#">Health Packages</a>
        </div>

        <div className="footer-column">
          <h4>Departments</h4>
          <a href="#">Cardiology</a>
          <a href="#">Neurology</a>
          <a href="#">Orthopedics</a>
          <a href="#">Pediatrics</a>
          <a href="#">Diagnostics</a>
        </div>

        <div className="footer-column">
          <h4>Contact Us</h4>
          <div className="footer-contact-item">
            <span className="material-symbols-outlined">location_on</span>
            <span>
              123 Medical Square, <br />
              Central Business District, <br />
              London, UK 10012
            </span>
          </div>
          <div className="footer-contact-item">
            <span className="material-symbols-outlined">call</span>
            <span>+1 (800) 555-Clinic Connect</span>
          </div>
          <div className="footer-contact-item">
            <span className="material-symbols-outlined">mail</span>
            <span>clinicconnect.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Clinic Connect Medical Group. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
