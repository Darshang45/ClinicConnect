import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowUp, FiBell, FiFileText, FiGrid, FiLogOut, FiMessageSquare, FiSearch, FiSettings, FiShield, FiUser, FiUsers } from "react-icons/fi";
import patientPhoto from "../../../assets/images/hero/patient1.jpg";
import NotificationList from "../../../components/common/NotificationList";
import SignOut from "../../../components/common/SignOut";
import { notifications } from "../data/notifications";
import "../../../styles/patient_dashboard.css";

const mainNavigation = [{ label: "Dashboard", icon: FiGrid }, { label: "Billing", icon: FiFileText }, { label: "My Doctors", icon: FiUsers }];
const accountNavigation = [{ label: "Profile", icon: FiUser }, { label: "Settings", icon: FiSettings }, { label: "Sign Out", icon: FiLogOut, danger: true, isSignOut: true }];

function DashboardHeader() {
  const [openPanel, setOpenPanel] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const location = useLocation();
  const isInboxOpen = location.pathname === "/patient/inbox";

  useEffect(() => {
    const updateScrollButton = () => setShowScrollButton(window.scrollY > 320);
    window.addEventListener("scroll", updateScrollButton, { passive: true });
    updateScrollButton();

    return () => window.removeEventListener("scroll", updateScrollButton);
  }, []);

  const togglePanel = (panel) => {
    setOpenPanel((currentPanel) => currentPanel === panel ? null : panel);
  };

  return (
    <>
      <aside className="pd-sidebar">
        <div className="pd-sidebar-inner">
          <a className="pd-brand" href="#dashboard"><span className="pd-brand-mark"><FiShield /></span><span><strong>Clinic Connect</strong><small>Clinical Portal</small></span></a>
          <nav className="pd-sidebar-nav" aria-label="Primary navigation">{mainNavigation.map(({ label, icon: Icon }) => <a className={`pd-nav-link ${activeSection === label ? "is-active" : ""}`} href={`#${label.toLowerCase().replace(" ", "-")}`} key={label} onClick={() => setActiveSection(label)}><Icon /><span>{label}</span></a>)}</nav>
          <nav className="pd-sidebar-account" aria-label="Account navigation">{accountNavigation.map(({ label, icon: Icon, danger, isSignOut }) => isSignOut ? <SignOut className={`pd-nav-link ${danger ? "is-danger" : ""}`} direct key={label} redirectTo="/patient/login"><Icon /><span>{label}</span></SignOut> : <a className={`pd-nav-link ${danger ? "is-danger" : ""}`} href={`#${label.toLowerCase().replace(" ", "-")}`} key={label}><Icon /><span>{label}</span></a>)}</nav>
        </div>
      </aside>
      <header className="pd-topbar">
        <label className="pd-search" aria-label="Search patient information"><FiSearch /><input placeholder="Search patients, reports, or doctors..." type="search" /></label>
        <div className="pd-header-actions">
          
          <Link className={`pd-icon-button ${isInboxOpen ? "is-open" : ""}`} to={isInboxOpen ? "/patient/dashboard" : "/patient/inbox"} aria-label={isInboxOpen ? "Close inbox" : "Open inbox"}><FiMessageSquare /></Link>
          <div className="pd-navbar-menu">
            <button className={`pd-icon-button pd-notification-button ${openPanel === "notifications" ? "is-open" : ""}`} type="button" aria-label="Open notifications" aria-expanded={openPanel === "notifications"} onClick={() => togglePanel("notifications")}><FiBell /></button>
            {openPanel === "notifications" && <div className="pd-navbar-popover" role="dialog" aria-label="Notifications"><div className="pd-popover-heading"><h2>Notifications</h2><span>Mark all read</span></div><NotificationList items={notifications} /></div>}
          </div>
          <a className="pd-user-menu" href="#patient-profile"><span className="pd-user-copy"><strong>Atharva Srivastava</strong><small>Platinum Member</small></span><img src={patientPhoto} alt="Atharva Srivastava" /></a>
        </div>
      </header>
      {showScrollButton && <button className="pd-scroll-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><FiArrowUp /></button>}
    </>
  );
}

export default DashboardHeader;
