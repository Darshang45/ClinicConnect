import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "../layouts/LandingLayout";

// Login
import PatientLogin from "../pages/Login/PatientLogin";
import StaffLogin from "../pages/Login/StaffLogin";

// Dashboards
import PatientDashboard from "../pages/Patient/Dashboard";
import DoctorDashboard from "../pages/doctor_dashboard/DoctorDashboard";
import ReceptionDashboard from "../pages/Reception/Dashboard";
import PharmacyDashboard from "../pages/Pharmacy/Dashboard";
import AdminDashboard from "../pages/Admin/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/portal/login" element={<StaffLogin />} />

        {/* Dashboards */}
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/reception/dashboard"
          element={<ReceptionDashboard />}
        />

        <Route
          path="/pharmacy/dashboard"
          element={<PharmacyDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
