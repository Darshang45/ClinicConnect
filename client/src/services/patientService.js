import api from "./api";

export const getPatientDashboardData = async () => {
  const response = await api.get("/v1/patients/dashboard");
  return response.data;
};

export const getPatientAppointments = async (params = {}) => {
  const response = await api.get("/v1/patients/appointments", { params });
  return response.data;
};

export const cancelPatientAppointment = async (appointmentId, cancellationReason = "Cancelled by patient") => {
  const response = await api.put(`/v1/patients/appointments/${appointmentId}/cancel`, {
    cancellationReason,
  });
  return response.data;
};

export const getPatientAppointmentDetails = async (appointmentId) => {
  const response = await api.get(`/v1/patients/appointments/${appointmentId}/details`);
  return response.data;
};

export const reschedulePatientAppointment = async (appointmentId, rescheduleData) => {
  const response = await api.patch(`/v1/patients/appointments/${appointmentId}/reschedule`, rescheduleData);
  return response.data;
};

export const getPatientProfile = async () => {
  const response = await api.get("/v1/patients/profile");
  return response.data;
};

export const updatePatientProfile = async (profileData) => {
  const response = await api.put("/v1/patients/profile", profileData);
  return response.data;
};
