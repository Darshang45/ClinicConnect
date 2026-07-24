export const validateMedicine = (body) => {
  const {
    name,
    genericName,
    brand,
    category,
    strength,
    manufacturer,
    unit,
    price,
  } = body;

  if (
    !name ||
    !genericName ||
    !brand ||
    !category ||
    !strength ||
    !manufacturer ||
    !unit ||
    price === undefined
  ) {
    return {
      valid: false,
      message: "All required fields must be provided.",
    };
  }

  if (price < 0) {
    return {
      valid: false,
      message: "Price cannot be negative.",
    };
  }

  return {
    valid: true,
  };
};