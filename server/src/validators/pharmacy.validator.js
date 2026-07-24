export const validatePharmacyOrder = (body) => {
  const { prescription } = body;

  if (!prescription) {
    return {
      valid: false,
      message: "Prescription is required.",
    };
  }

  return {
    valid: true,
  };
};