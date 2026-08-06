import api from "./api";

/* ==========================================
   Medical Reports
========================================== */

export const getReportsByPatient = async (patientId) => {
  const { data } = await api.get(
    `/medical-reports/patient/${patientId}`
  );

  return data;
};

export const getReportByAppointment = async (appointmentId) => {
  const { data } = await api.get(
    `/medical-reports/appointment/${appointmentId}`
  );

  return data;
};

export const createMedicalReport = async (formData) => {
  const { data } = await api.post(
    "/medical-reports",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const updateMedicalReport = async (
  reportId,
  formData
) => {
  const { data } = await api.put(
    `/medical-reports/${reportId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteMedicalReport = async (reportId) => {
  const { data } = await api.delete(
    `/medical-reports/${reportId}`
  );

  return data;
};