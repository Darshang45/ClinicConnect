export const validatePatient = (body) => {
  const {
    fullName,
    phone,
    gender,
    dateOfBirth,
  } = body;

  if (!fullName || !phone || !gender || !dateOfBirth) {
    return {
      valid: false,
      message: "Please fill all required fields.",
    };
  }

  return {
    valid: true,
  };
};