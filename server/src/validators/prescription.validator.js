export const validatePrescription = (body) => {
  const {
    appointment,
    patient,
    doctor,
    diagnosis,
    medicines,
  } = body;

  if (!appointment || !patient || !doctor || !diagnosis) {
    return {
      valid: false,
      message: "Appointment, patient, doctor and diagnosis are required.",
    };
  }

  if (!Array.isArray(medicines) || medicines.length === 0) {
    return {
      valid: false,
      message: "At least one medicine is required.",
    };
  }

  for (const medicine of medicines) {
    if (
      !medicine.medicine ||
      !medicine.dosage ||
      !medicine.frequency ||
      !medicine.duration ||
      !medicine.quantity
    ) {
      return {
        valid: false,
        message: "Each medicine must contain medicine, dosage, frequency, duration and quantity.",
      };
    }
  }

  return {
    valid: true,
  };
};