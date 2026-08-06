import PatientDashboardPage from "../PatientDashboardPage";
import UpcomingAppointments from "../appointments/UpcomingAppointments";

function PatientAppointmentsPage() {
  return (
    <PatientDashboardPage>
      <UpcomingAppointments isDedicatedPage={true} />
    </PatientDashboardPage>
  );
}

export default PatientAppointmentsPage;
