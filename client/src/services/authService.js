const roleProfiles = {
  Admin: { name: "Dr. Alexander Pierce", shortName: "Dr. Alexander", roleTitle: "Chief Medical Officer" },
  Doctor: { name: "Dr. Sarah Mitchell", shortName: "Dr. Sarah", roleTitle: "Medical Doctor" },
  Receptionist: { name: "Elena Rodriguez", shortName: "Elena", roleTitle: "Receptionist" },
  Pharmacist: { name: "Alex Morgan", shortName: "Alex", roleTitle: "Pharmacist" },
  Patient: { name: "Atharva Srivastava", shortName: "Atharva", roleTitle: "Patient" },
};

const avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuC9gcHKCW866UuJ6uC8JGW5BZtkikPDDWd4g5fboiuNVec_HSjzwtN4nM06eJAQoFAM_AnV2irwULU9gsp7FNbcjqY_HOJC7kAbh1VpbsoEnUhStV6vz2b3XS-cSItnd_7suXEExDOxhO1j5G9oo-Yw_Ce3A_6NjmrZYoJ0IrkXRHKtCwnN1YHQMLeIC_emsL6nhLKMe7hu2UT8cQz_Qswq3gsKp-wSyLU9O6rr4VMa8cVxVnJeKvmo";

export function createStaffSession({ email, role }) {
  const profile = roleProfiles[role] || roleProfiles.Admin;

  return {
    token: `local-${Date.now()}`,
    user: { ...profile, avatar, email, role },
  };
}

export function createPatientSession({ mobile }) {
  const profile = roleProfiles.Patient;

  return {
    token: `local-${Date.now()}`,
    user: { ...profile, avatar, mobile, role: "Patient" },
  };
}
