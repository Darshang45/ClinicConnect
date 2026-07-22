export const adminUser = {
  name: "Dr. Alexander Pierce",
  shortName: "Dr. Alexander",
  roleTitle: "Chief Medical Officer",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9gcHKCW866UuJ6uC8JGW5BZtkikPDDWd4g5fboiuNVec_HSjzwtN4nM06eJAQoFAM_AnV2irwULU9gsp7FNbcjqY_HOJC7kAbh1VpbsoEnUhStV6vz2b3XS-cSItnd_7suXEExDOxhO1j5G9oo-Yw_Ce3A_6NjmrZYoJ0IrkXRHKtCwnN1YHQMLeIC_emsL6nhLKMe7hu2UT8cQz_Qswq3gsKp-wSyLU9O6rr4VMa8cVxVnJeKvmo",
};

export const navigation = [
  { label: "Dashboard", icon: "dashboard", to: "/admin/dashboard" }, { label: "Patients", icon: "person", to: "/admin/patients" }, { label: "Doctors", icon: "medical_services", to: "/admin/doctors" },
  { label: "Receptionists", icon: "support_agent", to: "/admin/receptionists" }, { label: "Pharmacy", icon: "medication", to: "/admin/pharmacy" }, { label: "Settings", icon: "settings", to: "/admin/profile" },
];

export const analyticsCards = [
  { id: "patients", title: "Total Patients", value: "14,208", icon: "groups", iconTone: "primary", trend: { direction: "positive", icon: "trending_up", label: "12%" } },
  { id: "appointments", title: "Today's Appointments", value: "342", icon: "clinical_notes", iconTone: "tertiary", trend: { direction: "negative", icon: "trending_down", label: "4%" } },
  { id: "emergency", title: "Emergency Cases", value: "12", icon: "e911_emergency", iconTone: "secondary", valueTone: "danger", trend: { direction: "neutral", label: "Active now" } },
  { id: "labs", title: "Pending Lab Approvals", value: "14", icon: "science", iconTone: "primary", trend: { direction: "neutral", label: "Needs signature" } },
];

export const recipients = ["All Personnel", "Doctors", "Patients"];

export const appointments = [
  { id: "PT-2291", patient: "Elena Martinez", initials: "EM", doctor: "Dr. Sarah Chen", department: "Cardiology", time: "09:30 AM", status: "Confirmed", statusTone: "success", avatarTone: "primary" },
  { id: "PT-3044", patient: "James Wilson", initials: "JW", doctor: "Dr. Robert Fox", department: "Neurology", time: "10:15 AM", status: "Waiting", statusTone: "neutral", avatarTone: "tertiary" },
  { id: "PT-2882", patient: "Amara Kalu", initials: "AK", doctor: "Dr. Linda Gray", department: "Pediatrics", time: "11:00 AM", status: "Confirmed", statusTone: "success", avatarTone: "primary-fixed" },
];

export const quickActions = [
  { id: "patient", label: "Patient", icon: "person_add", to: "/admin/patients" }, { id: "doctor", label: "Doctor", icon: "medical_services", to: "/admin/doctors" }, { id: "appointment", label: "Appt.", icon: "assignment_add" }, { id: "pharmacy", label: "Pharmacy", icon: "inventory" }, { id: "reports", label: "Reports", icon: "lab_profile" },
];

export const inventory = [
  { id: "insulin", name: "Insulin Stock", value: 12, label: "12% Critical", tone: "danger" },
  { id: "antibiotics", name: "General Antibiotics", value: 85, label: "85% Optimal", tone: "success" },
];

export const departmentHeads = [
  { id: "david-miller", name: "Dr. David Miller", department: "Cardiology", status: "On Duty", statusTone: "success", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGcp7h_v3Tq7CoxHE1HEtcq_1j0Vau3V6CrcYhxAWS3WRGTWfdV5SNk6GKhO3E20u9rveDfQKvmav0uc4V4EE-86bSgqHSdf8GjNXJ552SpzA-suMGq84QLO6Ws78XAQ19P1KgSUqQyXSmNjxzK4s8j72g56OSwtWtDnb6_-WTzDQbuRMZeUbeCJEjkeKMGQzewzXlBdMsRALGub4PXmx29Ac7SBqRyR9IPElLPqvj3HRskVheDKc", alt: "Portrait of Dr. David Miller" },
  { id: "julia-wang", name: "Dr. Julia Wang", department: "Pediatrics", status: "On Duty", statusTone: "success", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5lskUkG0R3AzgdPChCOpoeA0V7HsCPAH3MFB2p7VtFasR3yRYDPRUkCMs3lnMILiI0Kk1vDjCOTxL47QglR6JJLGcEgAigWi0vtFwFx_CgOp0KF8nOMmcxP4TY3oENuAoNd3nVhk4FcFSXJPwrw3D80CuZzxfIUx1RgPGHc0MToUqDgmL4LHxNr7XKiIl7MwaNMNxitnnF0BXYTvLNyQKpomSQg_GgtaKFp-rWokb4y_ugdXZZ4Yd", alt: "Portrait of Dr. Julia Wang" },
  { id: "samuel-lee", name: "Dr. Samuel Lee", department: "Surgery", status: "In Surgery", statusTone: "neutral", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGcp7h_v3Tq7CoxHE1HEtcq_1j0Vau3V6CrcYhxAWS3WRGTWfdV5SNk6GKhO3E20u9rveDfQKvmav0uc4V4EE-86bSgqHSdf8GjNXJ552SpzA-suMGq84QLO6Ws78XAQ19P1KgSUqQyXSmNjxzK4s8j72g56OSwtWtDnb6_-WTzDQbuRMZeUbeCJEjkeKMGQzewzXlBdMsRALGub4PXmx29Ac7SBqRyR9IPElLPqvj3HRskVheDKc", alt: "Portrait of Dr. Samuel Lee" },
  { id: "sofia-rossi", name: "Dr. Sofia Rossi", department: "Diagnostics", status: "Off Duty", statusTone: "danger", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_YvITlcblbVXmyVy49i_oc9wCIRke419cirZ_mCf0OXlBacN7_1nOUnhhAQrnKi5DWXR62wXL4a5SAXrYo1YnnMFlOJAIqSdw95udjRlmZQNnlN94qX2uFNMxaHHqgu68ogY5j8iFhqMo7TQtURwxc4wUATFIIhYMWijxy9qRSsJ_4b5VACStUa08m-Cs8ky2zo70sH2sR3zMAONfPP_Yc4xUFMJEfP6j4cS8ctrCMOg1am8KINNw", alt: "Portrait of Dr. Sofia Rossi" },
];
