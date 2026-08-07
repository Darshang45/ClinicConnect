import api from "./api";

// Search patients
export const searchPatients = async (keyword) => {
  const response = await api.get("/patients/search", {
    params: {
      keyword,
      limit: 10,
    },
  });

  return response.data;
};

// Get patient details
export const getPatientByPatientId = async (patientId) => {
  const response = await api.get(`/patients/patient-id/${patientId}`);

  return response.data;
};

// Update patient profile
export const updatePatientProfile = async (patientId, patientData) => {
  const response = await api.put(`/patients/${patientId}`, patientData);

  return response.data;
};