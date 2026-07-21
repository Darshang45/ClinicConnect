import AdminLayout from "../../layouts/AdminLayout";
import DashboardHero from "./components/DashboardHero";
import DepartmentHeads from "./components/DepartmentHeads";
import PharmacyInventory from "./components/PharmacyInventory";
import QuickActions from "./components/QuickActions";
import RecentAppointments from "./components/RecentAppointments";
import StatsCards from "./components/StatsCards";

function AdminDashboard() {
  return (
    <AdminLayout>
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
    </AdminLayout>
  );
}

export default AdminDashboard;
