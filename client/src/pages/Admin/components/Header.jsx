import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Notification from "../../../components/common/Notification/Notification";
import useAuth from "../../../hooks/useAuth";
import SignOut from "../../../components/common/SignOut";
import ThemeToggle from "../../../components/common/ThemeToggle";
import { appointments } from "../data/dashboard";
import { createAdminProfile, getProfileDetails } from "../data/profile";
import { Avatar } from "./common";

const adminNotifications = appointments.map((appointment) => ({
  id: appointment.id,
  title: `${appointment.status} appointment`,
  description: `${appointment.patient} is scheduled with ${appointment.doctor}.`,
  time: appointment.time,
}));

function Header({ onOpenSidebar }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationMenuRef = useRef(null);
  const profile = createAdminProfile(user);
  const isChatRoute = pathname === "/admin/chat";

  useEffect(() => {
    if (!isNotificationOpen) return undefined;

    const closeWhenOutside = (event) => {
      if (!notificationMenuRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsNotificationOpen(false);
    };

    document.addEventListener("mousedown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isNotificationOpen]);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label="Open navigation"
          onClick={onOpenSidebar}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <label className="search-bar">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input
            className="input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patients, records, or doctors..."
            type="search"
            value={query}
          />
        </label>
      </div>
      <div className="navbar-actions">
        <div className="nav-icon-group">
          <ThemeToggle className="icon-button" />
          <div className="cc-signout-menu" ref={notificationMenuRef}>
            <button
              aria-controls="admin-notifications"
              aria-expanded={isNotificationOpen}
              aria-label={isNotificationOpen ? "Close notifications" : "Open notifications"}
              className="icon-button"
              type="button"
              onClick={() => setIsNotificationOpen((isOpen) => !isOpen)}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot" aria-hidden="true" />
            </button>
            {isNotificationOpen && (
              <section
                className="cc-signout-dropdown admin-notification-dropdown"
                id="admin-notifications"
                aria-label="Notifications"
              >
                <div className="cc-signout-user">
                  <p className="cc-signout-heading">Notifications</p>
                </div>
                <Notification items={adminNotifications} />
              </section>
            )}
          </div>
          <Link
            aria-current={isChatRoute ? "page" : undefined}
            aria-label="Open chat"
            className="icon-button"
            to="/admin/chat"
            onClick={() => setIsNotificationOpen(false)}
          >
            <span className="material-symbols-outlined">mail</span>
          </Link>
        </div>
        <SignOut
          profileDetails={getProfileDetails(profile)}
          profileHref="/admin/profile"
          triggerClassName="profile-summary iconless-button"
          user={profile}
        >
          <div className="profile-copy">
            <p className="profile-name">{profile.name}</p>
            <p className="profile-role">{profile.roleTitle}</p>
          </div>
          <Avatar alt={profile.name} size={40} src={profile.avatar} />
        </SignOut>
      </div>
    </header>
  );
}

export default Header;
