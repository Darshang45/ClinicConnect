import { useState, useEffect } from "react";
import useTheme from "../hooks/useTheme";
import Footer from "../pages/Admin/components/Footer";
import Header from "../pages/Admin/components/Header";
import Sidebar from "../pages/Admin/components/Sidebar";
import "../styles/admin_dashboard.css";

function AdminLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const linkId = "admin-bootstrap-css";
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      document.head.appendChild(link);
    }
    return () => {
      const existing = document.getElementById(linkId);
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return (
    <div className={`app-shell admin-dashboard ${theme === "dark" ? "dark" : ""}`.trim()}>
      <Sidebar className="desktop-sidebar" />
      {isMobileOpen && (
        <button
          className="drawer-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div
        className={`mobile-drawer ${isMobileOpen ? "open" : ""}`.trim()}
        aria-hidden={!isMobileOpen}
      >
        <Sidebar
          onNavigate={() => setIsMobileOpen(false)}
        />
      </div>
      <Header
        onOpenSidebar={() => setIsMobileOpen(true)}
      />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default AdminLayout;

/**
 * Bootstrap is loaded only for Admin routes.
 *
 * Do NOT import Bootstrap globally (main.jsx/index.html),
 * because it overrides the Landing Page styles
 * (.navbar, .container, .btn, forms, typography, etc.).
 *
 * This runtime loading intentionally isolates the Admin UI
 * from the public website.
 */