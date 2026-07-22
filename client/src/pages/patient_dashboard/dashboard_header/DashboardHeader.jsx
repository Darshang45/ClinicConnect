import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowUp,
  FiBell,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiSearch,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import patientPhoto from "../../../assets/images/hero/patient1.jpg";
import Notification from "../../../components/common/Notification/Notification";
import SignOut from "../../../components/common/SignOut";
import useAuth from "../../../hooks/useAuth";
import { notifications } from "../data/notifications";
import "../../../styles/patient_dashboard.css";

const mainNavigation = [
  { label: "Dashboard", icon: FiGrid, to: "/patient/dashboard" },
  { label: "Billing", icon: FiFileText, to: "/patient/billing" },
  { label: "My Doctors", icon: FiUsers, to: "/patient/doctors" },
];
const accountNavigation = [
  { label: "Profile", icon: FiUser, to: "/patient/profile" },
  { label: "Sign Out", icon: FiLogOut, danger: true, isSignOut: true },
];

function DashboardHeader() {
  const [openPanel, setOpenPanel] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const profile = user || {
    name: "Atharva Srivastava",
    roleTitle: "Platinum Member",
    avatar: patientPhoto,
  };
  const isInboxOpen = location.pathname === "/patient/inbox";
  const activeSection = mainNavigation.find((item) => item.to === location.pathname)?.label || "Dashboard";

  useEffect(() => {
    const updateScrollButton = () => setShowScrollButton(window.scrollY > 320);
    window.addEventListener("scroll", updateScrollButton, { passive: true });
    updateScrollButton();

    return () => window.removeEventListener("scroll", updateScrollButton);
  }, []);

  const togglePanel = (panel) => {
    setOpenPanel((currentPanel) => (currentPanel === panel ? null : panel));
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {isSidebarOpen && (
        <button
          aria-label="Close navigation"
          className="pd-sidebar-backdrop"
          onClick={closeSidebar}
          type="button"
        />
      )}
      <aside className={`pd-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="pd-sidebar-inner">
          <a className="pd-brand" href="#dashboard" onClick={closeSidebar}>
            <span className="pd-brand-mark">
              <FiShield />
            </span>
            <span>
              <strong>Clinic Connect</strong>
              <small>Patient Portal</small>
            </span>
          </a>
          <nav className="pd-sidebar-nav" aria-label="Primary navigation">
            {mainNavigation.map(({ label, icon: Icon, to }) => (
              <Link
                className={`pd-nav-link ${activeSection === label ? "is-active" : ""}`}
                key={label}
                to={to}
                onClick={() => {
                  closeSidebar();
                }}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <nav className="pd-sidebar-account" aria-label="Account navigation">
            {accountNavigation.map(
              ({ label, icon: Icon, danger, isSignOut, to }) =>
                isSignOut ? (
                  <SignOut
                    className={`pd-nav-link ${danger ? "is-danger" : ""}`}
                    direct
                    key={label}
                    redirectTo="/login"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SignOut>
                ) : (
                  <Link
                    className={`pd-nav-link ${danger ? "is-danger" : ""}`}
                    key={label}
                    to={to}
                    onClick={closeSidebar}
                  >
                    <Icon />
                    <span>{label}</span>
                  </Link>
                ),
            )}
          </nav>
        </div>
      </aside>
      <header className="pd-topbar">
        <button
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
          className="pd-menu-toggle"
          onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
          type="button"
        >
          <FiMenu />
        </button>
        <label className="pd-search" aria-label="Search patient information">
          <FiSearch />
          <input
            placeholder="Search patients, reports, or doctors..."
            type="search"
          />
        </label>
        <div className="pd-header-actions">
          <Link
            className={`pd-icon-button ${isInboxOpen ? "is-open" : ""}`}
            to={isInboxOpen ? "/patient/dashboard" : "/patient/inbox"}
            aria-label={isInboxOpen ? "Close inbox" : "Open inbox"}
          >
            <FiMessageSquare />
          </Link>
          <div className="pd-navbar-menu">
            <button
              className={`pd-icon-button pd-notification-button ${openPanel === "notifications" ? "is-open" : ""}`}
              type="button"
              aria-label="Open notifications"
              aria-expanded={openPanel === "notifications"}
              onClick={() => togglePanel("notifications")}
            >
              <FiBell />
            </button>
            {openPanel === "notifications" && (
              <div
                className="pd-navbar-popover"
                role="dialog"
                aria-label="Notifications"
              >
                <div className="pd-popover-heading">
                  <h2>Notifications</h2>
                  <span>Mark all read</span>
                </div>
                <Notification items={notifications} />
              </div>
            )}
          </div>
          <SignOut
            redirectTo="/login"
            triggerClassName="pd-user-menu"
            user={profile}
          >
            <span className="pd-user-copy">
              <strong>{profile.name}</strong>
              <small>{profile.roleTitle || profile.role}</small>
            </span>
            <img src={profile.avatar || patientPhoto} alt={profile.name} />
          </SignOut>
        </div>
      </header>
      {showScrollButton && (
        <button
          className="pd-scroll-top"
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FiArrowUp />
        </button>
      )}
    </>
  );
}

export default DashboardHeader;
