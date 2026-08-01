import { useState } from "react";
import { sendPatientOtp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/login.css";

function PatientLogin() {
  const navigate = useNavigate();
  const { patientLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setIsSendingOtp(true);
      setMessage("");

      const response = await sendPatientOtp(email);

      if (response.success) {
        setIsOtpSent(true);
        setMessage(response.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");

      await patientLogin(email, otp);

      navigate("/patient/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // const handleSendOtp = () => {
  //   if (!/^\d{10}$/.test(mobile)) {
  //     setMessage("Enter a valid 10-digit mobile number.");
  //     return;
  //   }

  //   setIsSendingOtp(true);
  //   setMessage("");
  //   window.setTimeout(() => {
  //     setIsOtpSent(true);
  //     setIsSendingOtp(false);
  //     setMessage("OTP sent. Use 123456 to continue.");
  //   }, 500);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   if (otp !== DEMO_OTP) {
  //     setMessage("Enter the correct OTP to continue.");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   window.setTimeout(() => {
  //     login({ mobile, role: "Patient" });
  //     navigate("/patient/dashboard");
  //   }, 500);
  // };

  return (
    <div className="login-page">
      <header className="login-page-header">
        <h2>
          <span className="material-symbols-outlined" aria-hidden="true">
            security
          </span>
          Secure Healthcare Management System
        </h2>
      </header>
      <main className="login-main">
        <div className="login-shell">
          <section className="login-card">
            <div className="login-card-brand">
              <div className="login-logo-stack">
                <div className="login-logo-mark">
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    health_and_safety
                  </span>
                </div>
                <span className="login-brand-name">Clinic Connect</span>
              </div>
              <h3>Welcome Back</h3>
              <p className="login-card-subtitle">
                Login to access your patient portal
              </p>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label" htmlFor="patient-email">
                  Email Address
                </label>
                <div className="login-input-wrap">
                  <span
                    className="material-symbols-outlined login-field-icon"
                    aria-hidden="true"
                  >
                    email
                  </span>
                  <input
                    className="login-input"
                    id="patient-email"
                    inputMode="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="e.g. john.doe@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>
              <button
                className="login-submit"
                disabled={isSendingOtp}
                type="button"
                onClick={handleSendOtp}
              >
                {isSendingOtp ? (
                  <span className="login-spinner" aria-label="Sending OTP" />
                ) : (
                  "Send OTP"
                )}
              </button>
              {isOtpSent && (
                <div className="login-field">
                  <label className="login-label" htmlFor="patient-otp">
                    OTP
                  </label>
                  <div className="login-input-wrap">
                    <span
                      className="material-symbols-outlined login-field-icon"
                      aria-hidden="true"
                    >
                      lock
                    </span>
                    <input
                      className="login-input"
                      id="patient-otp"
                      inputMode="numeric"
                      maxLength="6"
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 6-digit OTP"
                      required
                      type="text"
                      value={otp}
                    />
                  </div>
                </div>
              )}
              {message && (
                <p className="login-card-subtitle" role="status">
                  {message}
                </p>
              )}
              {isOtpSent && (
                <button
                  className="login-submit"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <span
                      className="login-spinner"
                      aria-label="Verifying OTP"
                    />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              )}
            </form>
            <div className="login-card-security">
              <span className="material-symbols-outlined" aria-hidden="true">
                verified_user
              </span>
              <p>Secure Patient Access</p>
            </div>
          </section>
          <nav className="login-footer" aria-label="Login support links">
            {["Support", "Privacy Policy", "System Status"].map((link) => (
              <a
                href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                key={link}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}

export default PatientLogin;
