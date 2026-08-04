import api from "./api";

export const getDepartments = async (params = {}) => {
  const { data } = await api.get("/departments", {
    params,
  });

  return data;
};

export const getDepartmentById = async (id) => {
  const { data } = await api.get(`/departments/${id}`);

  return data;
};

export const createDepartment = async (departmentData) => {
  const { data } = await api.post("/departments", departmentData);

  return data;
};

export const updateDepartment = async (id, departmentData) => {
  const { data } = await api.put(
    `/departments/${id}`,
    departmentData
  );

  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/departments/${id}`);

  return data;
};

export const searchDepartments = async (keyword, params = {}) => {
  const { data } = await api.get("/departments/search", {
    params: {
      keyword,
      ...params,
    },
  });

  return data;
};

export const toggleDepartmentStatus = async (id) => {
  const { data } = await api.put(
    `/departments/${id}/toggle-status`
  );

  return data;
};