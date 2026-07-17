import arisThorne from "../../../assets/doctors/aris-thorne.jpg";
import lindaHamilton from "../../../assets/doctors/linda-hamilton.jpg";
import michaelChen from "../../../assets/doctors/michael-chen.jpg";
import sarahJenkins from "../../../assets/doctors/sarah-jenkins.jpg";

const doctors = [
  {
    name: "Dr. Michael Chen",
    department: "Cardiology",
    image: michaelChen,
    status: "Available",
    room: "Room 302 • Current: -",
    tone: "available",
  },
  {
    name: "Dr. Sarah Jenkins",
    department: "Pediatrics",
    image: sarahJenkins,
    status: "In Consultation",
    room: "Room 105 • Ends in 12m",
    tone: "consultation",
  },
  {
    name: "Dr. Aris Thorne",
    department: "Dermatology",
    image: arisThorne,
    status: "Available",
    room: "Room 208 • Next appt 10:00",
    tone: "available",
  },
  {
    name: "Dr. Linda Hamilton",
    department: "Oncology",
    image: lindaHamilton,
    status: "Off Duty",
    room: "Returns tomorrow 08:00",
    tone: "off-duty",
  },
];

export default doctors;
