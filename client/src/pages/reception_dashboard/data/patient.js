import patientOneImage from "../../../assets/images/hero/patient1.jpg";
import patientTwoImage from "../../../assets/images/hero/patient2.jpg";
import patientImage from "../../../assets/patients/samuel-jackson.jpg";

export const patients = [
  {
    id: "PN-4452",
    name: "Samuel L. Jackson",
    image: patientImage,
    details: "Patient ID: #PN-4452 • Male • 74 yrs",
    alerts: ["High Blood Pressure", "Penicillin Allergy"],
    lastVisit: "Aug 12, 2023 - General Exam",
    primaryDoctor: "Dr. Linda Hamilton",
    report: "Lab Results: Blood Panel",
    reportDate: "UPLOADED 3 DAYS AGO",
  },
  {
    id: "PN-4453",
    name: "Emily Blunt",
    image: patientOneImage,
    details: "Patient ID: #PN-4453 • Female • 41 yrs",
    alerts: ["No known allergies"],
    lastVisit: "Aug 10, 2023 - Follow-up Visit",
    primaryDoctor: "Dr. Linda Hamilton",
    report: "Medication Review",
    reportDate: "UPLOADED 5 DAYS AGO",
  },
  {
    id: "PN-4454",
    name: "Sarah Parker",
    image: patientTwoImage,
    details: "Patient ID: #PN-4454 • Female • 33 yrs",
    alerts: ["Asthma", "No known allergies"],
    lastVisit: "Aug 08, 2023 - Cardiology Review",
    primaryDoctor: "Dr. Julianne Moore",
    report: "ECG Results",
    reportDate: "UPLOADED TODAY",
  },
];

export default patients[0];
