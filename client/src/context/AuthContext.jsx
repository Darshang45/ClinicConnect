import { useContext, useEffect, useState } from "react";
import AuthContext from "./authStore";

import {
  loginStaff,
  verifyPatientOtp,
  completePatientProfile,
  getCurrentUser,
  logoutUser,
} from "../services/authService";
import socketService from "../services/socketService";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const REGISTRATION_EMAIL = "registrationEmail";
const REGISTRATION_TOKEN = "registrationToken";

const restoreTabSession = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const user = sessionStorage.getItem(USER_KEY);

  if (token) return { token, user };

  const legacyToken = localStorage.getItem(TOKEN_KEY);
  const legacyUser = localStorage.getItem(USER_KEY);
  if (legacyToken) {
    sessionStorage.setItem(TOKEN_KEY, legacyToken);
    if (legacyUser) sessionStorage.setItem(USER_KEY, legacyUser);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token: legacyToken || "", user: legacyUser };
};

const tabSession = restoreTabSession();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(tabSession.token);

  const [user, setUser] = useState(() => {
    const storedUser = tabSession.user;
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  const clearRegistrationSession = () => {
    sessionStorage.removeItem(REGISTRATION_EMAIL);
    sessionStorage.removeItem(REGISTRATION_TOKEN);
  };

  const logout = () => {
    socketService.disconnect();
    logoutUser();
    clearRegistrationSession();
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
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

  const staffLogin = async (email, password) => {
    const response = await loginStaff({
      email,
      password,
    });

    sessionStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    setUser(response.user);

    return response.user;
  };

  const patientLogin = async (email, otp) => {
    try {
      const response = await verifyPatientOtp(email, otp);
      sessionStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);

      const currentUser = await getCurrentUser();
      sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser.user));
      setUser(currentUser.user);

      return currentUser.user;
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      throw error;
    }
  };

  const saveRegistrationSession = (email, registrationToken) => {
    sessionStorage.setItem(REGISTRATION_EMAIL, email);
    sessionStorage.setItem(REGISTRATION_TOKEN, registrationToken);
  };

  const getRegistrationSession = () => {
    return {
      email: sessionStorage.getItem(REGISTRATION_EMAIL),
      registrationToken: sessionStorage.getItem(REGISTRATION_TOKEN),
    };
  };

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

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedUserData };
      sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  };

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
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
