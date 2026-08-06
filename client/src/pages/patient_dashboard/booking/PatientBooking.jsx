import { useEffect } from "react";
import Appointment from "../../landing/appointment/Appointment";
import PatientDashboardPage from "../PatientDashboardPage";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";

function PatientBooking() {
  const { clearAppointment } = useAppointmentBooking();

  useEffect(() => {
    clearAppointment();
  }, []);

  return (
    <PatientDashboardPage>
      <Appointment />
    </PatientDashboardPage>
  );
}

export default PatientBooking;
