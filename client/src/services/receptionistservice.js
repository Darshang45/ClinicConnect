import api from "./api";

// ==========================================
// Receptionist Dashboard
// ==========================================

export const getReceptionistDashboard = async () => {
  const response = await api.get("/receptionist/dashboard");

  return response.data;
};

// ==========================================
// Today's Appointments
// ==========================================

export const getTodayAppointments = async ({
  page = 1,
  limit = 10,
  date,
} = {}) => {
  const response = await api.get("/receptionist/today-appointments", {
    params: {
      page,
      limit,
      ...(date ? { date } : {}),
    },
  });

  return response.data;
};

// ==========================================
// Pending Check-ins
// ==========================================

export const getPendingCheckIns = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/receptionist/dashboard/pending-checkins", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// ==========================================
// Today's Walk-ins
// ==========================================

export const getTodayWalkIns = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/receptionist/dashboard/walkins", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// ==========================================
// Queue
// ==========================================

export const getQueue = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/receptionist/dashboard/queue", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// ==========================================
// Check-in Patient
// ==========================================

export const checkInPatient = async (appointmentId) => {
  const response = await api.patch(
    `/receptionist/check-in/${appointmentId}`,
  );

  return response.data;
};

// ==========================================
// Start Consultation
// ==========================================

export const startConsultation = async (appointmentId) => {
  const response = await api.patch(
    `/receptionist/start-consultation/${appointmentId}`,
  );

  return response.data;
};

// ==========================================
// Complete Appointment
// ==========================================

export const completeAppointment = async (appointmentId) => {
  const response = await api.patch(
    `/receptionist/complete/${appointmentId}`,
  );

  return response.data;
};

// ==========================================
// Cancel Appointment
// ==========================================

export const cancelAppointment = async (
  appointmentId,
  { cancelledBy = "Receptionist", cancellationReason = "" } = {},
) => {
  const response = await api.patch(
    `/receptionist/cancel/${appointmentId}`,
    {
      cancelledBy,
      cancellationReason,
    },
  );

  return response.data;
};

// ==========================================
// Create Walk-in Appointment
// ==========================================

export const createWalkInAppointment = async (walkInData) => {
  const response = await api.post("/receptionist/walk-in", walkInData);
  return response.data;
};

// ==========================================
// Departments
// ==========================================

export const getReceptionistDepartments = async () => {
  const response = await api.get("/receptionist/departments");
  return response.data;
};


// ==========================================
// Doctors
// ==========================================

export const getReceptionistDoctors = async (departmentId) => {
  const response = await api.get("/receptionist/doctors", {
    params: departmentId
      ? { department: departmentId }
      : {},
  });

  return response.data;
};


// ==========================================
// Available Appointment Slots
// ==========================================

export const getReceptionistAvailableSlots = async ({
  doctorId,
  date,
} = {}) => {
  const response = await api.get("/receptionist/available-slots", {
    params: {
      doctor: doctorId,
      date,
    },
  });

  return response.data;
};

// ==========================================
// Live Doctor Availability Status
// ==========================================

export const getDoctorsStatus = async () => {
  const response = await api.get("/receptionist/doctors/status");
  return response.data;
};

export const updateDoctorStatus = async (doctorId, payload) => {
  const response = await api.patch(`/receptionist/doctors/${doctorId}/status`, payload);
  return response.data;
};