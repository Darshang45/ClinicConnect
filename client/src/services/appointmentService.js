import api from "./api";

/**
 * ==========================================
 * Public APIs (Landing Page)
 * ==========================================
 */

// Get all active departments
export const getPublicDepartments = async (params = {}) => {
  const response = await api.get("/public/departments", {
    params,
  });

  return response.data;
};

// Get available doctors by department
export const getPublicDoctorsByDepartment = async (
  departmentId,
  params = {}
) => {
  const response = await api.get(
    `/public/doctors/${departmentId}`,
    {
      params,
    }
  );

  return response.data;
};

// Get available slots for a doctor
export const getAvailableSlots = async (doctorId, date) => {
  const response = await api.get("/availability/slots", {
    params: {
      doctorId,
      date,
    },
  });

  return response.data;
};

/**
 * ==========================================
 * Protected APIs (Patient / Receptionist)
 * ==========================================
 */

// Create Appointment
export const createAppointment = async (appointmentData) => {
  const response = await api.post(
    "/appointments",
    appointmentData
  );

  return response.data;
};