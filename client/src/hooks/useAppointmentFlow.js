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

  const completePendingAppointment = async (customData = null, options = {}) => {
    const isNewPatient = typeof customData === "object" && customData !== null && "isNewPatient" in customData ? customData.isNewPatient : (options.isNewPatient || false);
    let activeAppointment = (customData && typeof customData === "object" && "doctorId" in customData) ? customData : pendingAppointment;
    
    if (!activeAppointment || !Object.values(activeAppointment).some((val) => val !== "")) {
      const stored = sessionStorage.getItem("pendingAppointment");
      if (stored) {
        try {
          activeAppointment = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored appointment:", e);
        }
      }
    }

    const hasAppointmentData = activeAppointment && Object.values(activeAppointment).some((val) => val !== "");

    if (!hasAppointmentData) {
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
        activeAppointment.consultationType === "In-Person"
          ? "Offline"
          : activeAppointment.consultationType || "Offline";

      await createAppointment({
        doctorId: activeAppointment.doctorId,
        departmentId: activeAppointment.departmentId,
        appointmentDate: activeAppointment.appointmentDate,
        appointmentTime: activeAppointment.appointmentTime,
        consultationType,
        reason: activeAppointment.reason,
        symptoms: activeAppointment.symptoms,
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
