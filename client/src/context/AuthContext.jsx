import { useContext, useEffect, useState } from "react";
import AuthContext from "./authStore";

import {
  loginStaff,
  verifyPatientOtp,
  completePatientProfile,
  getCurrentUser,
  logoutUser,
} from "../services/authService";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const REGISTRATION_EMAIL = "registrationEmail";
const REGISTRATION_TOKEN = "registrationToken";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  const clearRegistrationSession = () => {
    sessionStorage.removeItem(REGISTRATION_EMAIL);
    sessionStorage.removeItem(REGISTRATION_TOKEN);
  };

  const logout = () => {
    logoutUser();
    clearRegistrationSession();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  };

  // ==========================================
  // Restore Session
  // ==========================================

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        localStorage.setItem(USER_KEY, JSON.stringify(response.user));

        setUser(response.user);
      } catch (error) {
        console.error(error);

        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ==========================================
  // Staff Login
  // ==========================================

  const staffLogin = async (email, password) => {
    const response = await loginStaff({
      email,
      password,
    });

    localStorage.setItem(TOKEN_KEY, response.token);

    setToken(response.token);

    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setUser(response.user);

    return response.user;
  };

  // ==========================================
  // Patient Login
  // ==========================================

  const patientLogin = async (email, otp) => {
  try {
    const response = await verifyPatientOtp(email, otp);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);

    const currentUser = await getCurrentUser();

    localStorage.setItem(USER_KEY, JSON.stringify(currentUser.user));
    setUser(currentUser.user);

    return currentUser.user;
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
    throw error;
  }
};

  // ==========================================
  // Save Registration Session
  // ==========================================
  const saveRegistrationSession = (email, registrationToken) => {
    sessionStorage.setItem(REGISTRATION_EMAIL, email);
    sessionStorage.setItem(REGISTRATION_TOKEN, registrationToken);
  };

  // ==========================================
  // get Registration Session
  // ==========================================

  const getRegistrationSession = () => {
    return {
      email: sessionStorage.getItem(REGISTRATION_EMAIL),
      registrationToken: sessionStorage.getItem(REGISTRATION_TOKEN),
    };
  };

  // ==========================================
  // complete Patient Registration
  // ==========================================

  const completePatientRegistration = async (profileData) => {
  const { registrationToken } = getRegistrationSession();

  if (!registrationToken) {
    throw new Error("Registration session expired.");
  }

  const response = await completePatientProfile(
    profileData,
    registrationToken
  );

  return response;
};

  // ==========================================
  // Context Value
  // ==========================================

  const value = {
    loading,
    token,
    user,
    isAuthenticated: !!token && !!user,
    role: user?.role || "",
    email: user?.email || "",
    staffLogin,
    patientLogin,
    saveRegistrationSession,
    getRegistrationSession,
    clearRegistrationSession,
    completePatientRegistration,
    logout,
  };

  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);
