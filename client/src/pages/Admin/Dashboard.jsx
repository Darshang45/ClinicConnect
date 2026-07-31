import { useLocation } from "react-router-dom";
import Inbox from "../../components/common/Inbox/Inbox";
import AdminLayout from "../../layouts/AdminLayout";
import { doctorConversations } from "../doctor_dashboard/data/communications";
import DashboardHero from "./components/DashboardHero";
import DepartmentHeads from "./components/DepartmentHeads";
import PharmacyInventory from "./components/PharmacyInventory";
import QuickActions from "./components/QuickActions";
import RecentAppointments from "./components/RecentAppointments";
import StatsCards from "./components/StatsCards";

function AdminDashboard() {
  const { pathname } = useLocation();
  const isChatRoute = pathname === "/admin/chat";

  return (
    <AdminLayout>
      {isChatRoute ? (
        <Inbox
          className="admin-chat-workspace"
          threads={doctorConversations}
        />
      ) : (
        <div className="dashboard-grid" id="dashboard">
          <DashboardHero />
          <StatsCards />

          <div className="full-span content-stack">
            <RecentAppointments />
            <div className="two-column-grid">
              <QuickActions />
              <PharmacyInventory />
            </div>
          </div>
          <DepartmentHeads />
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
