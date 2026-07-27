export const validateAdmin = (data) => {
  const { user, employeeId } = data;

  if (!user) {
    return {
      valid: false,
      message: "User is required.",
    };
  }

  if (!employeeId) {
    return {
      valid: false,
      message: "Employee ID is required.",
    };
  }

  return {
    valid: true,
  };
};