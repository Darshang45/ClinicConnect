import api from "./api";

export const getDoctors = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const response = await api.get("/admins/doctors", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};


export const getDepartments = async () => {
  const { data } = await api.get("/departments");
  return data;
};

export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/admins/doctors/${doctorId}`);

  return response.data;
};


export const createDoctor = async (doctorData) => {
  const response = await api.post(
    "/admins/doctors",
    doctorData
  );

  return response.data;
};


export const updateDoctor = async (
  doctorId,
  doctorData
) => {
  const response = await api.put(
    `/admins/doctors/${doctorId}`,
    doctorData
  );

  return response.data;
};


export const deleteDoctor = async (doctorId) => {
  const response = await api.delete(
    `/admins/doctors/${doctorId}`
  );

  return response.data;
};