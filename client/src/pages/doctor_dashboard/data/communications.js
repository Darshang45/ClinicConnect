import patientOne from "../../../assets/images/hero/patient1.jpg";
import patientTwo from "../../../assets/images/hero/patient2.jpg";

export const doctorConversations = [
  { id: "sarah", name: "Sarah Parker", preview: "I have arrived for my follow-up appointment.", time: "10:12 AM", unread: 2, image: patientOne },
  { id: "reception", name: "Reception Desk", preview: "Emily Blunt has completed her intake form.", time: "9:54 AM", unread: 1, image: patientTwo },
  { id: "pharmacy", name: "LuxeHealth Pharmacy", preview: "Prescription #LH-8821 is ready for review.", time: "Yesterday", unread: 0, image: patientOne },
];

export const doctorNotifications = [
  { id: "queue", title: "Queue update", description: "Sarah Parker is ready for her cardiology consultation.", time: "2 min ago" },
  { id: "report", title: "Diagnostic report ready", description: "Alexander Mitchell's echocardiogram is available to review.", time: "18 min ago" },
  { id: "pharmacy", title: "Pharmacy confirmation", description: "Prescription #LH-8817 has been dispensed successfully.", time: "Today" },
  { id: "follow-up", title: "Follow-up reminder", description: "Johnathan Reed is due for a six-week follow-up consultation.", time: "Yesterday" },
];
