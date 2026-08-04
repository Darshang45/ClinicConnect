import api from "./api";

export const getPatients = async (params = {}) => {
  const { data } = await api.get("/patients", {
    params,
  });

  return data;
};

export const getPatientById = async (id) => {
  const { data } = await api.get(`/patients/${id}`);

  return data;
};

export const deletePatient = async (id) => {
  const { data } = await api.delete(`/patients/${id}`);

  return data;
};