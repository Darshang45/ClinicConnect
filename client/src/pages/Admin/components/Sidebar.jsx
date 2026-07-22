import { navigation } from "../data/dashboard";
import { NavLink } from "react-router-dom";
import SignOut from "../../../components/common/SignOut";
import { Button } from "./common";

function Sidebar({ className = "", onNavigate }) {
  return (
    <aside className={`sidebar ${className}`.trim()}>
      <div className="sidebar-brand">
        <h1>Clinic Connect</h1>
        <p>Admin Portal</p>
      </div>
      <nav className="sidebar-nav" aria-label="Admin navigation">
        {navigation.map((item) => (
          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`.trim()}
            to={item.to}
            key={item.label}
            onClick={onNavigate}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <Button className="button-full" icon="emergency_share">
          Emergency Support
        </Button>
        <div className="sidebar-support-links">
          <a href="#support" onClick={onNavigate}>
            <span className="material-symbols-outlined" aria-hidden="true">
              help
            </span>
            Support
          </a>
          <SignOut
            className="sidebar-signout-button"
            direct
            onLogout={onNavigate}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
