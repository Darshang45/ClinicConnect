import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import SignOut from "../../../components/common/SignOut";
import ThemeToggle from "../../../components/common/ThemeToggle";
import { createAdminProfile, getProfileDetails } from "../data/profile";
import { Avatar } from "./common";

function Header({ onOpenSidebar }) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const profile = createAdminProfile(user);
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
          <button
            className="icon-button"
            type="button"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="notification-dot" aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" aria-label="Messages">
            <span className="material-symbols-outlined">mail</span>
          </button>
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
