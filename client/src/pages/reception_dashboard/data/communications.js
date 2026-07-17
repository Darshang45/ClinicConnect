import patientOneImage from "../../../assets/images/hero/patient1.jpg";
import patientTwoImage from "../../../assets/images/hero/patient2.jpg";
import patientImage from "../../../assets/patients/samuel-jackson.jpg";

export const receptionConversations = [
  { id: "emily", name: "Emily Blunt", preview: "I have completed my intake form.", time: "10:12 AM", unread: 2, image: patientOneImage },
  { id: "sarah", name: "Sarah Parker", preview: "Please let me know when Dr. Moore is available.", time: "9:54 AM", unread: 1, image: patientTwoImage },
  { id: "samuel", name: "Samuel L. Jackson", preview: "My lab results are ready for collection.", time: "Yesterday", unread: 0, image: patientImage },
];

export const receptionNotifications = [
  { id: "doctor-available", title: "Doctor Available", description: "Dr. Linda Hamilton is ready for the next patient.", time: "2 min ago" },
  { id: "doctor-busy", title: "Doctor Busy", description: "Dr. Julianne Moore has started a consultation.", time: "8 min ago" },
  { id: "doctor-leave", title: "Doctor On Leave", description: "Dr. Michael Chen is unavailable until tomorrow.", time: "18 min ago" },
  { id: "doctor-delayed", title: "Doctor Delayed", description: "Dr. Hamilton is running 15 minutes behind schedule.", time: "Today" },
  { id: "consultation-finished", title: "Doctor Finished Consultation", description: "Dr. Moore is ready to receive the next patient.", time: "Today" },
  { id: "emergency-assigned", title: "Emergency Doctor Assigned", description: "Dr. Chen has been assigned to emergency room 2.", time: "Today" },
  { id: "walkin-accepted", title: "Walk-in Accepted", description: "Sarah Parker has been added to the cardiology queue.", time: "Today" },
  { id: "doctor-returned", title: "Doctor Returned", description: "Dr. Michael Chen is back and available for appointments.", time: "Yesterday" },
];
