/**
 * Format any date or time string into 12-hour AM/PM format.
 * Examples:
 *   "09:55" -> "09:55 AM"
 *   "14:30" -> "02:30 PM"
 *   "2026-08-10T18:30:00.000Z" -> "06:30 PM" (or local equivalent)
 */
export const formatTime = (timeInput) => {
  if (!timeInput) return "";

  // 1. If it's a 24h string like "09:55", "14:30", "18:30:00"
  if (typeof timeInput === "string" && /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeInput.trim())) {
    const parts = timeInput.trim().split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (!isNaN(hours)) {
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      const strHours = String(hours).padStart(2, "0");
      return `${strHours}:${minutes} ${ampm}`;
    }
  }

  // 2. If it's already an AM/PM formatted string e.g. "09:55 AM"
  if (typeof timeInput === "string" && (timeInput.includes("AM") || timeInput.includes("PM"))) {
    return timeInput;
  }

  // 3. Otherwise parse as Date object/ISO string
  const dateObj = new Date(timeInput);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return String(timeInput);
};

/**
 * Format Date to DD/MM/YYYY format
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default formatTime;
