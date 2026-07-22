export const calculateAppointmentTime = (
  appointmentDate,
  appointmentTime
) => {
  const appointmentStart = new Date(
    `${appointmentDate}T${appointmentTime}:00`
  );

  const appointmentEnd = new Date(appointmentStart);

  appointmentEnd.setMinutes(
    appointmentEnd.getMinutes() + 15
  );

  return {
    appointmentStart,
    appointmentEnd,
  };
};