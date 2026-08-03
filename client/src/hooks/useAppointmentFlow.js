import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createAppointment } from "../services/appointmentService";
import { useAppointmentBooking } from "../context/AppointmentBookingContext";

const useAppointmentFlow = () => {
  const navigate = useNavigate();

  const { pendingAppointment, clearAppointment, isPending } =
    useAppointmentBooking();

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const completePendingAppointment = async ({ isNewPatient = false } = {}) => {
    if (!isPending) {
      // Existing login, no pending appointment
      navigate("/patient/dashboard", {
        state: { successMessage: "Welcome back!" },
        replace: true,
      });
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      const consultationType =
        pendingAppointment.consultationType === "In-Person"
          ? "Offline"
          : pendingAppointment.consultationType || "Offline";

      await createAppointment({
        doctorId: pendingAppointment.doctorId,
        departmentId: pendingAppointment.departmentId,
        appointmentDate: pendingAppointment.appointmentDate,
        appointmentTime: pendingAppointment.appointmentTime,
        consultationType,
        reason: pendingAppointment.reason,
        symptoms: pendingAppointment.symptoms,
      });

      clearAppointment();

      const successMessage = isNewPatient
        ? "Welcome to Clinic Connect! Your appointment has been booked successfully."
        : "Appointment booked successfully.";

      navigate("/patient/dashboard", {
        state: { successMessage },
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setBookingError(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return {
    bookingLoading,
    bookingError,
    completePendingAppointment,
  };
};

export default useAppointmentFlow;
