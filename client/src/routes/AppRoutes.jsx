import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "../layouts/LandingLayout";

// Login
import PatientLogin from "../pages/Login/PatientLogin";
import StaffLogin from "../pages/Login/StaffLogin";
import PatientDashboard from "../pages/patient_dashboard/PatientDashboard";
import PatientInbox from "../pages/patient_dashboard/inbox/Inbox";
import DoctorDashboard from "../pages/doctor_dashboard/DoctorDashboard";
import ReceptionDashboard from "../pages/reception_dashboard/ReceptionDashboard";
import PharmacyDashboard from "../pages/Pharmacy/PharmacyDashboard";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminProfile from "../pages/Admin/Profile";
import DoctorChatPanel from "../pages/doctor_dashboard/chat/DoctorChatPanel";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route path="/login" element={<PatientLogin />} />
        {/* <Route path="/patient/login" element={<PatientLogin />} /> */}
        
        <Route path="/login/staff" element={<StaffLogin />} />

        {/* Dashboards */}
        <Route element={<ProtectedRoute allowedRoles={["Patient"]} loginPath="/patient/login" />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/inbox" element={<PatientInbox />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/inbox" element={<DoctorChatPanel/>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
          <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
          <Route path="/reception/inbox" element={<ReceptionDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Pharmacist"]} />}>
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
