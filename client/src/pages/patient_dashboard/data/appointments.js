import doctorOne from "../../../assets/images/doctors/doctor-1.jpg";
import doctorTwo from "../../../assets/images/doctors/doctor-2.jpg";

export const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Mitchell",
    title: "Senior Cardiologist",
    department: "Cardiology",
    date: "Oct 28, 2024",
    time: "10:30 AM",
    status: "Confirmed",
    image: doctorOne,
  },
];

export const appointmentHistory = [
  {
    id: 1,
    date: "Oct 02, 2024",
    type: "Ongoing Treatment",
    title: "Hypertension Management",
    description: "Daily Dosage: Amlodipine 5mg ? Review in 15 days",
    provider: "General Medicine Dept.",
    icon: "medical_services",
    featured: true,
  },
  {
    id: 2,
    date: "Sep 15, 2024",
    type: "Diagnostic Report",
    title: "Annual Lipid Profile & Liver Panel",
    description: "HDL: 65 mg/dL ? LDL: 90 mg/dL",
    provider: "Central Lab Services",
    icon: "biotech",
  },
  {
    id: 3,
    date: "July 10, 2024",
    type: "Past Procedure",
    title: "MRI Cranium with Contrast",
    description: "No significant intracranial abnormalities detected.",
    provider: "Radiology Department",
    icon: "visibility",
  },
];

export const medicalRecords = [
  {
    id: 1,
    diagnosis: "Essential hypertension",
    visitDate: "Oct 02, 2024",
    doctor: "Dr. Sarah Mitchell",
    hospital: "Clinic Connect Clinical Center",
  },
  {
    id: 2,
    diagnosis: "Preventive cardiac screening",
    visitDate: "Sep 15, 2024",
    doctor: "Dr. Marcus Lee",
    hospital: "Clinic Connect Diagnostic Lab",
  },
  {
    id: 3,
    diagnosis: "Annual wellness consultation",
    visitDate: "Aug 12, 2024",
    doctor: "Dr. Anna Foster",
    hospital: "Clinic Connect Clinical Center",
  },
];

export const pastAppointments = [
  {
    id: 1,
    diagnosis: "Hypertension follow-up",
    doctor: "Dr. Sarah Mitchell",
    prescription: "Amlodipine 5mg",
    invoice: "INV-10428",
    visitDate: "Oct 02, 2024",
    image: doctorOne,
  },
  {
    id: 2,
    diagnosis: "Cardiac health review",
    doctor: "Dr. Marcus Lee",
    prescription: "Lifestyle plan",
    invoice: "INV-10291",
    visitDate: "Sep 03, 2024",
    image: doctorTwo,
  },
];
