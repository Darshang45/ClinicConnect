export const calculateAppointmentTime = (
  appointmentDate,
  appointmentTime
) => {
  // Explicitly parse as IST (UTC+05:30) so storage is consistent
  // regardless of whether the server runs in UTC or IST.
  const appointmentStart = new Date(
    `${appointmentDate}T${appointmentTime}:00+05:30`
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