export const validateDoctor = (body) => {
  const {
    user,
    department,
    specialization,
    qualification,
    experience,
    consultationFee,
    licenseNumber,
  } = body;

  if (
    !user ||
    !department ||
    !specialization ||
    !qualification ||
    experience === undefined ||
    consultationFee === undefined ||
    !licenseNumber
  ) {
    return {
      valid: false,
      message: "All required fields must be provided.",
    };
  }

  if (experience < 0) {
    return {
      valid: false,
      message: "Experience cannot be negative.",
    };
  }

  if (consultationFee < 0) {
    return {
      valid: false,
      message: "Consultation fee cannot be negative.",
    };
  }

  return {
    valid: true,
  };
};