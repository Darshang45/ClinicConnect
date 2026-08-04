import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admins/dashboard");
  return response.data;
};

export const getRecentAppointments = async () => {
  const response = await api.get("/admins/dashboard/recent");
  return response.data;
};