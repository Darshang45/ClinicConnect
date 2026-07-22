import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

function AdminRegistrationPage({ RegistrationForm, role }) {
  const [registrations, setRegistrations] = useState([]);

  const registerUser = (registration) => {
    setRegistrations((current) => [...current, { ...registration, role }]);
  };

  return (
    <AdminLayout>
      <div className="reception-dashboard">
        <RegistrationForm onRegister={registerUser} />
        {registrations.length > 0 && (
          <p role="status">{registrations.at(-1).firstName} has been registered.</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRegistrationPage;
