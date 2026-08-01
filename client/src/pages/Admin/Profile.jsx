import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import BackButton from "../../components/common/BackButton";
import AdminLayout from "../../layouts/AdminLayout";
import PatientProfile from "../patient_dashboard/profile/PatientProfile";
import { adminProfileFields, createAdminProfile } from "./data/profile";

function AdminProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => createAdminProfile(user));

  return (
    <AdminLayout>
      <div className="admin-profile-page">
        <PatientProfile
          className="admin-profile-card"
          editLabel="Edit Profile"
          fields={adminProfileFields}
          patient={profile}
          profileDescription="Administrator"
          saveLabel="Save Changes"
          title="Admin Profile"
          onUpdate={setProfile}
        />
        <div className="admin-page-back">
          <BackButton to="/admin/dashboard" />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;
