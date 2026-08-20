import api from "./api";

const multipartConfig = {
  transformRequest: [
    (data, headers) => {
      headers?.setContentType?.(undefined);
      return data;
    },
  ],
};

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

export const updateMyPatientProfile = async (profileData) => {
  const response = await api.put(
    "/v1/patients/profile",
    profileData,
    multipartConfig,
  );
  return response.data;
};

export const getPatientPrescriptions = async (params = {}) => {
  const response = await api.get("/v1/patients/prescriptions", { params });
  return response.data;
};

export const downloadPrescriptionPDF = async (prescriptionId) => {
  const response = await api.get(`/v1/patients/prescriptions/${prescriptionId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

export const getPatientTimeline = async (params = { page: 1, limit: 20 }) => {
  const response = await api.get("/v1/patients/timeline", { params });
  return response.data;
};

// Health Metrics
export const getPatientHealthMetrics = async (params = { page: 1, limit: 10 }) => {
  const response = await api.get("/v1/patients/health-metrics", { params });
  return response.data;
};

export const createPatientHealthMetric = async (metricData) => {
  const response = await api.post("/v1/patients/health-metrics", metricData);
  return response.data;
};

export const updatePatientHealthMetric = async (metricId, metricData) => {
  const response = await api.put(`/v1/patients/health-metrics/${metricId}`, metricData);
  return response.data;
};

export const deletePatientHealthMetric = async (metricId) => {
  const response = await api.delete(`/v1/patients/health-metrics/${metricId}`);
  return response.data;
};

// Medical Reports
export const getPatientReports = async (params = { page: 1, limit: 10 }) => {
  const response = await api.get('/v1/patients/medical-reports', { params });
  return response.data;
};

export const uploadPatientReport = async (reportData) => {
  const response = await api.post(
    "/medical-reports",
    reportData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
// export const uploadPatientReport = async (reportData) => {
//   const response = await api.post('/v1/patients/medical-reports', reportData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return response.data;
// };

export const deletePatientReport = async (reportId) => {
  const response = await api.delete(`/v1/patients/medical-reports/${reportId}`);
  return response.data;
};

// Doctors Directory
export const getPatientDoctors = async (params = {}) => {
  const response = await api.get('/v1/patients/doctors', { params });
  return response.data;
};
