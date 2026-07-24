export const validateMedicalReport = (body) => {
  const {
    appointment,
    reportType,
    title,
  } = body;

  if (!appointment || !reportType || !title) {
    return {
      valid: false,
      message: "Appointment, report type and title are required.",
    };
  }

  return {
    valid: true,
  };
};