import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "../layouts/LandingLayout";

// Login
import PatientLogin from "../pages/Login/PatientLogin";
import StaffLogin from "../pages/Login/StaffLogin";
import PatientDashboard from "../pages/patient_dashboard/PatientDashboard";
import PatientDashboardPage from "../pages/patient_dashboard/PatientDashboardPage";
import PatientBooking from "../pages/patient_dashboard/booking/PatientBooking";
import BillingInsurance from "../pages/patient_dashboard/billing/BillingInsurance";
import DoctorDirectory from "../pages/patient_dashboard/doctor_directory/DoctorDirectory";
import PatientInbox from "../pages/patient_dashboard/inbox/Inbox";
import PatientProfilePage from "../pages/patient_dashboard/profile/PatientProfilePage";
import DoctorDashboard from "../pages/doctor_dashboard/DoctorDashboard";
import ReceptionDashboard from "../pages/reception_dashboard/ReceptionDashboard";
import PharmacyDashboard from "../pages/Pharmacy/PharmacyDashboard";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminProfile from "../pages/Admin/Profile";
import AdminRegistrationPage from "../pages/Admin/AdminRegistrationPage";
import DoctorRegistration from "../pages/Admin/components/DoctorRegistration";
import PharmacyRegistration from "../pages/Admin/components/PharmacyRegistration";
import ReceptionRegistration from "../pages/Admin/components/ReceptionRegistration";
import DoctorChatPanel from "../pages/doctor_dashboard/chat/DoctorChatPanel";
import PatientRegistration from "../pages/reception_dashboard/patient_registration/PatientRegistration";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/login/staff" element={<StaffLogin />} />

        {/* Dashboards */}
        <Route element={<ProtectedRoute allowedRoles={["Patient"]} loginPath="/login" />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/book" element={<PatientBooking />} />
          <Route path="/patient/billing" element={<PatientDashboardPage><BillingInsurance /></PatientDashboardPage>} />
          <Route path="/patient/doctors" element={<PatientDashboardPage><DoctorDirectory /></PatientDashboardPage>} />
          <Route path="/patient/profile" element={<PatientProfilePage />} />
          <Route path="/patient/inbox" element={<PatientInbox />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/inbox" element={<DoctorChatPanel/>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
          <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
          <Route path="/reception/inbox" element={<ReceptionDashboard />} />
          <Route path="/reception/billing" element={<ReceptionDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Pharmacist"]} />}>
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/chat" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/patients" element={<AdminRegistrationPage RegistrationForm={PatientRegistration} role="Patient" />} />
          <Route path="/admin/doctors" element={<AdminRegistrationPage RegistrationForm={DoctorRegistration} role="Doctor" />} />
          <Route path="/admin/receptionists" element={<AdminRegistrationPage RegistrationForm={ReceptionRegistration} role="Receptionist" />} />
          <Route path="/admin/pharmacy" element={<AdminRegistrationPage RegistrationForm={PharmacyRegistration} role="Pharmacist" />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
