export const adminProfileFields = [
  { label: "Full Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Department", key: "department" },
  { label: "Qualification", key: "qualification" },
  { label: "Experience", key: "experience" },
  { label: "Address", key: "address" },
];

export const createAdminProfile = (user) => ({
  ...user,
  name: user?.name || "Dr. Alexander Pierce",
  role: "Admin / Main Doctor",
  email: user?.email || "admin@clinicconnect.com",
  phone: "+1 (800) 555-0110",
  department: "Medical Administration",
  qualification: "MBBS, MD",
  experience: "15 years",
  address: "123 Medical Square, London, UK 10012",
});

export const getProfileDetails = (profile) => [
  { label: "Full name", value: profile.name },
  { label: "Role", value: profile.role },
  { label: "Email", value: profile.email },
  { label: "Department", value: profile.department },
];
