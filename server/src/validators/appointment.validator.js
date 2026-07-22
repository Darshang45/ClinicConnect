export const validateAppointment = (body) => {
  const {
    patientId,
    doctorId,
    departmentId,
    appointmentDate,
    appointmentTime,
    reason,
  } = body;

  if (
    !patientId ||
    !doctorId ||
    !departmentId ||
    !appointmentDate ||
    !appointmentTime ||
    !reason
  ) {
    return {
      valid: false,
      message: "Please fill all required fields.",
    };
  }

  return {
    valid: true,
  };
};