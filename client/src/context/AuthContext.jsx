import { useMemo, useState } from "react";
import AuthContext from "./authStore";
import { createPatientSession, createStaffSession } from "../services/authService";

const AUTH_STORAGE_KEY = "clinicconnect-auth";
const getStoredSession = () => {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  const value = useMemo(() => ({
    email: session?.user.email || "",
    isAuthenticated: Boolean(session?.token),
    role: session?.user.role || "",
    token: session?.token || "",
    user: session?.user || null,
    login: ({ email, mobile, role }) => {
      const nextSession = role === "Patient"
        ? createPatientSession({ mobile })
        : createStaffSession({ email, role });

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      return nextSession;
    },
    logout: () => {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setSession(null);
    },
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
