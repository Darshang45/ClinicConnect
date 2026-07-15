import { useState } from "react";
import { MdChatBubbleOutline, MdNotificationsNone, MdSearch } from "react-icons/md";
import "../../../styles/reception_dashboard.css";
import receptionistImage from "../../../assets/patients/elena-rodriguez.jpg";
import logo from "../../../assets/logo/clinicconnect-logo.svg";

const navigation = [
  { label: "Dashboard", href: "#welcome" },
  { label: "Today's Queue", href: "#queue" },
  { label: "Booking", href: "#booking" },
  { label: "Registration", href: "#registration" },
  { label: "Doctors", href: "#doctors" },
  { label: "Broadcast", href: "#broadcast" },
];

function DashboardHeader() {
  const [activeLink, setActiveLink] = useState("#welcome");

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
        <label className="rc-patient-search">
          <MdSearch />
          <input type="search" placeholder="Search patients..." aria-label="Search patients" />
        </label>
        <div className="rc-header-icon-group">
          <button className="rc-header-icon has-notification" type="button" aria-label="Notifications">
            <MdNotificationsNone />
          </button>
          <button className="rc-header-icon" type="button" aria-label="Open chat">
            <MdChatBubbleOutline />
          </button>
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
