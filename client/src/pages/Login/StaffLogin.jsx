import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/login.css";

const roles = [
  {
    key: "Admin",
    label: "Administrator",
    modalLabel: "Admin",
    subtitle: "(Main Doctor)",
    icon: "shield",
    route: "/admin/dashboard",
  },
  {
    key: "Doctor",
    label: "Medical Doctor",
    modalLabel: "Doctors",
    subtitle: "Clinical Staff",
    icon: "stethoscope",
    route: "/doctor/dashboard",
  },
  {
    key: "Receptionist",
    label: "Receptionist",
    modalLabel: "Receptionist",
    subtitle: "Front Desk",
    icon: "desk",
    route: "/reception/dashboard",
  },
  {
    key: "Pharmacist",
    label: "Pharmacist",
    modalLabel: "Pharmacist",
    subtitle: "Pharmacy",
    icon: "medication",
    route: "/pharmacy/dashboard",
  },
];

function StaffLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isRoleModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRoleModalOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      login({ email, role: selectedRole.key });
      navigate(selectedRole.route);
    }, 500);
  };

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
                Login to access the Hospital Management System
              </p>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label" htmlFor="role-trigger">
                  Select Role
                </label>
                <button
                  className="login-role-trigger"
                  id="role-trigger"
                  type="button"
                  onClick={() => setIsRoleModalOpen(true)}
                >
                  <span className="login-role-current">
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      {selectedRole.icon}
                    </span>
                    <span>{selectedRole.label}</span>
                  </span>
                  <span
                    className="material-symbols-outlined login-chevron"
                    aria-hidden="true"
                  >
                    expand_more
                  </span>
                </button>
              </div>
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">
                  Email
                </label>
                <div className="login-input-wrap">
                  <span
                    className="material-symbols-outlined login-field-icon"
                    aria-hidden="true"
                  >
                    person
                  </span>
                  <input
                    className="login-input"
                    id="login-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="e.g. jhon@clinicconnect.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>
              <div className="login-field">
                <label className="login-label" htmlFor="login-password">
                  Password
                </label>
                <div className="login-input-wrap">
                  <span
                    className="material-symbols-outlined login-field-icon"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                  <input
                    className="login-input has-password-toggle"
                    id="login-password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                  />
                  <button
                    className="login-password-toggle"
                    type="button"
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                    onClick={() => setIsPasswordVisible((current) => !current)}
                  >
                    <span className="material-symbols-outlined">
                      {isPasswordVisible ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <button
                className="login-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="login-spinner" aria-label="Logging in" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div className="login-card-security">
              <span className="material-symbols-outlined" aria-hidden="true">
                verified_user
              </span>
              <p>Authorized Personnel Only</p>
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
      {isRoleModalOpen && (
        <div className="role-modal-root" role="presentation">
          <button
            className="role-modal-overlay"
            type="button"
            aria-label="Close role selection"
            onClick={() => setIsRoleModalOpen(false)}
          />
          <section
            className="role-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
          >
            <div className="role-modal-header">
              <h4 id="role-modal-title">Select Your Role</h4>
              <button
                className="role-modal-close"
                type="button"
                aria-label="Close role selection"
                onClick={() => setIsRoleModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="role-grid">
              {roles.map((role) => (
                <button
                  className="role-option"
                  key={role.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setIsRoleModalOpen(false);
                  }}
                >
                  <span className="role-option-icon">
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      {role.icon}
                    </span>
                  </span>
                  <span className="role-option-copy">
                    <p className="role-option-name">{role.modalLabel}</p>
                    <p className="role-option-subtitle">{role.subtitle}</p>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default StaffLogin;
