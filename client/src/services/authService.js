import api from "./api";

// Matches the current backend resend-OTP guard.
export const PATIENT_OTP_RESEND_COOLDOWN_SECONDS = 60;

// ============================================
// 1. Staff Login
// POST /api/auth/login
// ============================================
export const loginStaff = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// ============================================
// 2. Get Current Logged In User
// GET /api/auth/me
// ============================================
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// ============================================
// 3. Change Password
// PUT /api/auth/change-password
// ============================================
export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData);

  return response.data;
};

// ============================================
// 4. Send Patient OTP
// POST /api/auth/patient/send-otp
// ============================================
export const sendPatientOtp = async (email) => {
  const response = await api.post("/auth/patient/send-otp", { email });

  return response.data;
};

// ============================================
// 5. Verify Patient OTP
// POST /api/auth/patient/verify-otp
// ============================================
export const verifyPatientOtp = async (email, otp) => {
  const response = await api.post("/auth/patient/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

// ============================================
// 6. Resend Patient OTP
// POST /api/auth/patient/resend-otp
// ============================================
export const resendPatientOtp = async (email) => {
  const response = await api.post("/auth/patient/resend-otp", { email });

  return response.data;
};

// ============================================
// 7. Complete Patient Profile
// POST /api/auth/patient/complete-profile
// ============================================
export const completePatientProfile = async (
  profileData,
  registrationToken,
) => {
  const response = await api.post(
    "/auth/patient/complete-profile",
    profileData,
    {
      headers: {
        Authorization: `Bearer ${registrationToken}`,
      },
    },
  );

  return response.data;
};

// ============================================
// 8. Staff Forgot Password - Send OTP
// POST /api/auth/staff/forgot-password
// ============================================
export const requestStaffForgotPassword = async (email) => {
  const response = await api.post("/auth/staff/forgot-password", { email });
  return response.data;
};

// ============================================
// 9. Staff Verify Forgot Password OTP
// POST /api/auth/staff/verify-forgot-password-otp
// ============================================
export const verifyStaffForgotPasswordOtp = async (email, otp) => {
  const response = await api.post("/auth/staff/verify-forgot-password-otp", {
    email,
    otp,
  });
  return response.data;
};

// ============================================
// 10. Staff Reset Password
// POST /api/auth/staff/reset-password
// ============================================
export const resetStaffPassword = async (
  email,
  otp,
  newPassword,
  confirmPassword,
) => {
  const response = await api.post("/auth/staff/reset-password", {
    email,
    otp,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

// ============================================
// Logout (Frontend Utility)
// ============================================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// const roleProfiles = {
//   Admin: { name: "Dr. Alexander Pierce", shortName: "Dr. Alexander", roleTitle: "Chief Medical Officer" },
//   Doctor: { name: "Dr. Sarah Mitchell", shortName: "Dr. Sarah", roleTitle: "Medical Doctor" },
//   Receptionist: { name: "Elena Rodriguez", shortName: "Elena", roleTitle: "Receptionist" },
//   Pharmacist: { name: "Alex Morgan", shortName: "Alex", roleTitle: "Pharmacist" },
//   Patient: { name: "Atharva Srivastava", shortName: "Atharva", roleTitle: "Patient" },
// };

// const avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuC9gcHKCW866UuJ6uC8JGW5BZtkikPDDWd4g5fboiuNVec_HSjzwtN4nM06eJAQoFAM_AnV2irwULU9gsp7FNbcjqY_HOJC7kAbh1VpbsoEnUhStV6vz2b3XS-cSItnd_7suXEExDOxhO1j5G9oo-Yw_Ce3A_6NjmrZYoJ0IrkXRHKtCwnN1YHQMLeIC_emsL6nhLKMe7hu2UT8cQz_Qswq3gsKp-wSyLU9O6rr4VMa8cVxVnJeKvmo";

// export function createStaffSession({ email, role }) {
//   const profile = roleProfiles[role] || roleProfiles.Admin;

//   return {
//     token: `local-${Date.now()}`,
//     user: { ...profile, avatar, email, role },
//   };
// }

// export function createPatientSession({ mobile }) {
//   const profile = roleProfiles.Patient;

//   return {
//     token: `local-${Date.now()}`,
//     user: { ...profile, avatar, mobile, role: "Patient" },
//   };
// }
