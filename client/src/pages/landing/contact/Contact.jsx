function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Reach Out to Us</h2>
          <p>We are here to assist you with any inquiries or support requirements. Our team is available 24/7 for urgent needs.</p>

          <div className="contact-items">
            <div className="contact-item">
              <div className="contact-icon">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="contact-label">Emergency Hotline</p>
                <p className="contact-value contact-value-primary">+1 (800) Clinic Connect</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="contact-label">Main Campus</p>
                <p className="contact-value">123 Wellness Plaza, Medical District, NY 10001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-card glass-card">
          <h3>Send a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Tell us how we can help..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
