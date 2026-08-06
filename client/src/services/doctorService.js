import api from "./api";

/* ==========================================
   Dashboard
========================================== */

export const getDoctorDashboard = async () => {
  const { data } = await api.get("/doctors/dashboard");
  return data;
};

export const getUpcomingAppointments = async () => {
  const { data } = await api.get("/doctors/dashboard/upcoming");
  return data;
};

export const getRecentPatients = async () => {
  const { data } = await api.get("/doctors/dashboard/patients");
  return data;
};

export const getRecentPrescriptions = async () => {
  const { data } = await api.get("/doctors/dashboard/prescriptions");
  return data;
};

/* ==========================================
   Queue
========================================== */

export const getTodayAppointments = async (doctorId) => {
  const { data } = await api.get(
    `/doctors/today-appointments/${doctorId}`
  );

  return data;
};

/* ==========================================
   Appointment
========================================== */

export const getAppointmentDetails = async (appointmentId) => {
  const { data } = await api.get(
    `/doctors/appointment/${appointmentId}`
  );

  return data;
};

/* ==========================================
   Patient
========================================== */

export const getPatientHistory = async (patientId) => {
  const { data } = await api.get(
    `/doctors/patient-history/${patientId}`
  );

  return data;
};

export const getPatientRecord = async (patientId) => {
  const { data } = await api.get(
    `/doctors/patient-record/${patientId}`
  );

  return data;
};

/* ==========================================
   Consultation
========================================== */

export const startConsultation = async (appointmentId) => {
  const { data } = await api.put(
    `/doctors/start-consultation/${appointmentId}`
  );

  return data;
};

export const updateConsultation = async (
  appointmentId,
  consultationData
) => {
  const { data } = await api.put(
    `/doctors/consultation/${appointmentId}`,
    consultationData
  );

  return data;
};

export const completeConsultation = async (appointmentId) => {
  const { data } = await api.put(
    `/doctors/complete-consultation/${appointmentId}`
  );

  return data;
};

/* ==========================================
   Prescription
========================================== */

export const createPrescription = async (prescriptionData) => {
  const { data } = await api.post(
    "/prescriptions",
    prescriptionData
  );

  return data;
};

export const getPrescriptionByAppointment = async (
  appointmentId
) => {
  const { data } = await api.get(
    `/prescriptions/appointment/${appointmentId}`
  );

  return data;
};

export const updatePrescription = async (
  prescriptionId,
  prescriptionData
) => {
  const { data } = await api.put(
    `/prescriptions/${prescriptionId}`,
    prescriptionData
  );

  return data;
};

/* ==========================================
   Patient Search
========================================== */

export const searchPatients = async (query) => {
  const { data } = await api.get(
    `/doctors/search-patient?q=${encodeURIComponent(query)}`
  );

  return data;
};

