export const validateDepartment = (body) => {
  const {
    name,
    code,
    consultationDuration,
    consultationFee,
  } = body;

  if (!name || !code) {
    return {
      valid: false,
      message: "Department name and code are required.",
    };
  }

  if (
    consultationDuration &&
    consultationDuration <= 0
  ) {
    return {
      valid: false,
      message: "Consultation duration must be greater than 0.",
    };
  }

  if (
    consultationFee &&
    consultationFee < 0
  ) {
    return {
      valid: false,
      message: "Consultation fee cannot be negative.",
    };
  }

  return {
    valid: true,
  };
};