import patientImage from "../../../assets/images/hero/patient2.jpg";

export const currentPatient = {
  id: "LH-8821",
  fullName: "Alexander Mitchell",
  age: "42y",
  gender: "Male",
  bloodGroup: "A Positive (+)",
  allergies: ["Penicillin"],
  image: patientImage,
  history: [
    {
      date: "Sept 12, 2023",
      title: "Hypertension Checkup",
      details: "BP: 145/95. Recommended diet changes and exercise regimen.",
      active: true,
    },
    {
      date: "May 05, 2023",
      title: "Acute Bronchitis",
      details: "Prescribed antibiotics course. Recovery confirmed after 10 days.",
    },
    {
      date: "Jan 18, 2023",
      title: "Annual Physical Exam",
      details: "All vitals within normal range. Slight Vitamin D deficiency.",
    },
  ],
  vitals: [
    { label: "Blood Pressure (mmHg)", value: "120/80", icon: "monitor_heart", tone: "error" },
    { label: "Heart Rate (bpm)", value: "72", icon: "ecg_heart", tone: "primary" },
    { label: "Temp (°C)", value: "36.8", icon: "device_thermostat", tone: "muted" },
  ],
  symptoms: "Patient reports mild chest tightness during exertion...",
  clinicalNotes: "Lung sounds clear, no edema observed...",
};
