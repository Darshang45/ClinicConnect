const timeline = [
  {
    time: "08:30 AM",
    title: "Shift Start - Receptionist Elena",
    description: "System login successful. Terminal ID: REC-04.",
    tone: "primary",
  },
  {
    time: "08:42 AM",
    title: "Emergency Arrival",
    description: "Walk-in patient (Sarah Connor) registered with priority HIGH. Dr. Aris notified.",
    tone: "secondary",
  },
  {
    time: "09:15 AM",
    title: "Lab Results Received",
    description: "3 automated lab reports synced for patient Samuel Jackson.",
    tone: "muted",
  },
  {
    time: "10:00 AM",
    title: "Scheduled Break",
    description: "Handover to Receptionist Mark scheduled.",
    tone: "muted",
    pending: true,
  },
];

export default timeline;
