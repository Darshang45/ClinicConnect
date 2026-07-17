export function AppointmentForm({ children, className = "appointment-form", onSubmit }) {
  return (
    <form className={className} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

function Appointment() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="appointment" id="book">
      <div className="appointment-inner">
        <div className="appointment-card glass-card">
          <div className="appointment-header">
            <h2>Book Your Consultation</h2>
            <p>Fast, secure, and intuitive appointment scheduling.</p>
          </div>

          <div className="appointment-steps">
            <div className="appointment-step">
              <div className="appointment-step-circle active">1</div>
              <span>Details</span>
            </div>
            <div className="appointment-step-line"></div>
            <div className="appointment-step">
              <div className="appointment-step-circle">2</div>
              <span>Schedule</span>
            </div>
            <div className="appointment-step-line"></div>
            <div className="appointment-step">
              <div className="appointment-step-circle">3</div>
              <span>Confirm</span>
            </div>
          </div>

          <AppointmentForm onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Patient Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Select Department</label>
              <select>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
              </select>
            </div>
            <div className="form-group">
              <label>Select Doctor</label>
              <select>
                <option>Dr. Sarah Williams</option>
                <option>Dr. Michael Chen</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Date</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Preferred Time</label>
              <select>
                <option>10:00 AM to 2:00 PM</option>
                <option>4:00 PM to 8:00 PM</option>
              </select>
            </div>
            <div className="form-group form-group-full">
              <label>Brief Description of Symptoms</label>
              <textarea rows="4" placeholder="How can we help you today?"></textarea>
            </div>
            <div className="form-group form-group-full">
              <button type="submit" className="btn btn-primary btn-block">
                Request Appointment
              </button>
            </div>
          </AppointmentForm>
        </div>
      </div>
    </section>
  );
}

export default Appointment;
