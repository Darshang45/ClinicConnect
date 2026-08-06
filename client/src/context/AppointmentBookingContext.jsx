import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppointmentBookingContext = createContext();

const STORAGE_KEY = "pendingAppointment";

const initialAppointment = {
  fullName: "",
  email: "",
  departmentId: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  consultationType: "",
  reason: "",
  symptoms: "",
};

export const AppointmentBookingProvider = ({ children }) => {
  const [pendingAppointment, setPendingAppointment] =
    useState(initialAppointment);

  const [appointmentStep, setAppointmentStep] = useState("FORM");

  // Restore pending appointment after refresh
  useEffect(() => {
    const savedAppointment = sessionStorage.getItem(STORAGE_KEY);

    if (savedAppointment) {
      try {
        setPendingAppointment(JSON.parse(savedAppointment));
      } catch (error) {
        console.error("Failed to restore pending appointment:", error);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Persist appointment
  useEffect(() => {
    const hasAppointment = Object.values(pendingAppointment).some(
      (value) => value !== ""
    );

    if (hasAppointment) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(pendingAppointment)
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [pendingAppointment]);

  // Save complete appointment
  const saveAppointment = (appointmentData) => {
    setPendingAppointment({
      ...initialAppointment,
      ...appointmentData,
    });
  };

  // Update only changed fields
  const updateAppointment = (updatedFields) => {
    setPendingAppointment((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Reset appointment
  const clearAppointment = () => {
    setPendingAppointment(initialAppointment);
    setAppointmentStep("FORM");
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      pendingAppointment,

      saveAppointment,

      updateAppointment,

      clearAppointment,

      appointmentStep,

      setAppointmentStep,

      isPending: Object.values(pendingAppointment).some(
        (value) => value !== ""
      ),
    }),
    [pendingAppointment, appointmentStep]
  );

  return (
    <AppointmentBookingContext.Provider value={value}>
      {children}
    </AppointmentBookingContext.Provider>
  );
};

export const useAppointmentBooking = () => {
  const context = useContext(AppointmentBookingContext);

  if (!context) {
    throw new Error(
      "useAppointmentBooking must be used within AppointmentBookingProvider"
    );
  }

  return context;
};