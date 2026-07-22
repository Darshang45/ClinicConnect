import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/sign_out.css";

function SignOut({
  children,
  className = "",
  direct = false,
  dropdownClassName = "",
  onLogout,
  profileDetails,
  profileHref,
  redirectTo = "/login/staff",
  role,
  triggerClassName = "",
  user: userProp,
}) {
  const { logout, user: authenticatedUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();
  const user = userProp || authenticatedUser;
  const displayName = user?.name || user?.shortName || "Staff member";
  const displayRole = role || user?.roleTitle || user?.role || "Staff";
  const details = profileDetails || [
    { label: "Full name", value: displayName },
    { label: "Role", value: displayRole },
    ...(user?.email ? [{ label: "Email", value: user.email }] : []),
  ];

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeWhenOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    onLogout?.();
    logout();
    navigate(redirectTo, { replace: true });
  };

  if (direct) {
    return (
      <button className={className} type="button" onClick={handleLogout}>
        {children || (
          <>
            <span className="material-symbols-outlined" aria-hidden="true">
              logout
            </span>
            Sign Out
          </>
        )}
      </button>
    );
  }

  return (
    <div className={`cc-signout-menu ${className}`.trim()} ref={menuRef}>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={`${displayName} profile`}
        className={`cc-signout-trigger ${triggerClassName}`.trim()}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        {children}
      </button>
      {isOpen && (
        <section
          className={`cc-signout-dropdown ${dropdownClassName}`.trim()}
          id={menuId}
          aria-label="User account menu"
        >
          <div className="cc-signout-user">
            <p className="cc-signout-heading">
              <span className="material-symbols-outlined" aria-hidden="true">
                person
              </span>
              Profile
            </p>
            <dl>
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {profileHref && (
            <Link
              className="cc-signout-profile-action"
              to={profileHref}
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                settings
              </span>
              My Profile
            </Link>
          )}
          <button
            className="cc-signout-action"
            type="button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              logout
            </span>
            Sign Out
          </button>
        </section>
      )}
    </div>
  );
}

export default SignOut;
