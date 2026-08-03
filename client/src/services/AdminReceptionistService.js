import api from "./api";

export const getReceptionists = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get("/admins/receptionists", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const getReceptionistById = async (id) => {
  const response = await api.get(`/admins/receptionists/${id}`);
  return response.data;
};

export const createReceptionist = async (data) => {
  const response = await api.post("/admins/receptionists", data);
  return response.data;
};

export const updateReceptionist = async (id, data) => {
  const response = await api.put(`/admins/receptionists/${id}`, data);
  return response.data;
};

export const deleteReceptionist = async (id) => {
  const response = await api.delete(`/admins/receptionists/${id}`);
  return response.data;
};
