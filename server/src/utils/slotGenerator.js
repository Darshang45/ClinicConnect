const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const convertMinutesToTime = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};


export const generateSlots = (
  startTime,
  endTime,
  breakStart,
  breakEnd,
  duration = 15
) => {

  const slots = [];

  let current = convertTimeToMinutes(startTime);

  const end = convertTimeToMinutes(endTime);

  const lunchStart = breakStart
    ? convertTimeToMinutes(breakStart)
    : null;

  const lunchEnd = breakEnd
    ? convertTimeToMinutes(breakEnd)
    : null;

  while (current + duration <= end) {

    if (
      lunchStart !== null &&
      current >= lunchStart &&
      current < lunchEnd
    ) {
      current = lunchEnd;
      continue;
    }

    slots.push({
      start: convertMinutesToTime(current),
      end: convertMinutesToTime(current + duration),
    });

    current += duration;
  }

  return slots;
};