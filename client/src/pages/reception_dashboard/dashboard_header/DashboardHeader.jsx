import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdChatBubbleOutline, MdNotificationsNone, MdSearch } from "react-icons/md";
import "../../../styles/reception_dashboard.css";
import receptionistImage from "../../../assets/patients/elena-rodriguez.jpg";
import logo from "../../../assets/logo/clinicconnect-logo.svg";
import ReceptionNotificationPanel from "./ReceptionNotificationPanel";

const navigation = [
  { label: "Dashboard", href: "#welcome" },
  { label: "Today's Queue", href: "#queue" },
  { label: "Booking", href: "#booking" },
  { label: "Registration", href: "#registration" },
  { label: "Doctors", href: "#doctors" },
  { label: "Broadcast", href: "#broadcast" },
];

function DashboardHeader({ openPanel, onTogglePanel, notificationButtonRef, notificationPanelRef }) {
  const [activeLink, setActiveLink] = useState("#welcome");
  const location = useLocation();
  const isChatOpen = location.pathname === "/reception/inbox";
  const isNotificationOpen = openPanel === "notifications";

  return (
    <header className="rc-dashboard-header">
      <div className="rc-brand-navigation">
        <a className="rc-brand" href="#welcome">
          <img src={logo} alt="ClinicConnect" />
          <span>ClinicConnect</span>
        </a>
        <nav className="rc-dashboard-nav" aria-label="Reception dashboard navigation">
          {navigation.map((item) => (
            <a
              aria-current={activeLink === item.href ? "page" : undefined}
              className={activeLink === item.href ? "is-active" : ""}
              href={item.href}
              key={item.label}
              onClick={() => setActiveLink(item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="rc-header-actions">
        
        <div className="rc-header-icon-group">
          <div className="rc-navbar-menu">
            <button
              className={`rc-header-icon has-notification ${isNotificationOpen ? "is-open" : ""}`}
              type="button"
              aria-label={isNotificationOpen ? "Close notifications" : "Open notifications"}
              aria-controls="reception-notifications"
              aria-expanded={isNotificationOpen}
              onClick={() => onTogglePanel("notifications")}
              ref={notificationButtonRef}
            >
              <MdNotificationsNone />
            </button>
            {isNotificationOpen && <ReceptionNotificationPanel panelRef={notificationPanelRef} />}
          </div>
          <Link
            className={`rc-header-icon ${isChatOpen ? "is-open" : ""}`}
            to={isChatOpen ? "/reception/dashboard" : "/reception/inbox"}
            aria-label={isChatOpen ? "Close inbox" : "Open inbox"}
          >
            <MdChatBubbleOutline />
          </Link>
        </div>
        <div className="rc-profile">
          <div className="rc-profile-copy">
            <p>Elena Rodriguez</p>
            <span>Lead Receptionist</span>
          </div>
          <img src={receptionistImage} alt="Elena Rodriguez" />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
