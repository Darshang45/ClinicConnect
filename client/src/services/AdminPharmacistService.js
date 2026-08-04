import api from "./api";

export const getPharmacists = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get("/admins/pharmacists", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const getPharmacistById = async (id) => {
  const response = await api.get(`/admins/pharmacists/${id}`);
  return response.data;
};

export const createPharmacist = async (data) => {
  const response = await api.post("/admins/pharmacists", data);
  return response.data;
};

export const updatePharmacist = async (id, data) => {
  const response = await api.put(`/admins/pharmacists/${id}`, data);
  return response.data;
};

export const deletePharmacist = async (id) => {
  const response = await api.delete(`/admins/pharmacists/${id}`);
  return response.data;
};
