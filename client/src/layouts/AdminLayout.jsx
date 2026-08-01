import { useState } from "react";
import useTheme from "../hooks/useTheme";
import Footer from "../pages/Admin/components/Footer";
import Header from "../pages/Admin/components/Header";
import Sidebar from "../pages/Admin/components/Sidebar";
import "../styles/admin_dashboard.css";

function AdminLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme } = useTheme();

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
