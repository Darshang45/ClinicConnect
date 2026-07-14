import doctorImage from "../../../assets/images/doctors/doctor-6.jpg";
import NotificationList from "../../../components/common/NotificationList";
import { doctorNotifications } from "../data/communications";
import "../../../styles/doctor_dashboard.css";
// import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { useState, useEffect } from "react";

function DashboardHeader({
  openPanel,
  onTogglePanel,
  chatButtonRef,
  notificationButtonRef,
  notificationPanelRef,
}) {
  // const isChatOpen = openPanel === "chat";
  const location = useLocation();
  const isChatOpen = location.pathname === "/doctor/inbox";
  const isNotificationOpen = openPanel === "notifications";
  const [activeLink, setActiveLink] = useState("#");
  const [menuOpen, setMenuOpen] = useState(false);
  
    const handleLinkClick = (e, href) => {
    e.preventDefault();
    setActiveLink(href);
    setMenuOpen(false);

    if (href === "#") return;

    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="doc-dashboard-header">
      <div className="doc-header-content">
        <div className="doc-brand" onClick={(e) => handleLinkClick(e, "#home")}>
          <div className="doc-brand-mark" aria-hidden="true" >
            <span className="material-symbols-outlined filled">medical_services</span>
          </div>
          <div>
            <p className="doc-brand-name">Clinic Connect</p>
            <p className="doc-brand-subtitle">Doctor Portal</p>
          </div>
        </div>

        <div className="doc-header-actions">
          <span className="doc-header-divider" aria-hidden="true" />
          <Link
            className={`doc-icon-button ${isChatOpen ? "is-open" : ""}`}
            to={isChatOpen ? "/doctor/dashboard" : "/doctor/inbox"}
            aria-label={isChatOpen ? "Close inbox" : "Open inbox"}
          >
            <FiMessageSquare />
          </Link>

          <div className="doc-navbar-menu">
            <button
              className={`doc-icon-button doc-notification-button ${isNotificationOpen ? "is-open" : ""}`}
              type="button"
              aria-label={isNotificationOpen ? "Close notifications" : "Open notifications"}
              aria-controls="doctor-notifications"
              aria-expanded={isNotificationOpen}
              onClick={() => onTogglePanel("notifications")}
              ref={notificationButtonRef}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="doc-notification-dot" />
            </button>
            {isNotificationOpen && (
              <section className="doc-notification-dropdown" id="doctor-notifications" ref={notificationPanelRef} aria-label="Notifications">
                <div className="doc-popover-heading">
                  <h2>Notifications</h2>
                  <span>Mark all read</span>
                </div>
                <NotificationList items={doctorNotifications} />
              </section>
            )}
          </div>
          <div className="doc-doctor-profile">
            <div className="doc-doctor-details">
              <strong>Dr. Julianne Moore</strong>
              <span>Senior Cardiologist</span>
            </div>
            <img src={doctorImage} alt="Dr. Julianne Moore" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
