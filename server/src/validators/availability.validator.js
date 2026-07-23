export const validateAvailability = (body) => {

  if (!body.doctor) {

    return {
      valid: false,
      message: "Doctor is required.",
    };

  }

  if (!body.schedule || body.schedule.length === 0) {

    return {
      valid: false,
      message: "Schedule is required.",
    };

  }

  return {
    valid: true,
  };

};