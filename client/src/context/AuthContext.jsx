import { useEffect, useMemo, useState } from "react";
import AuthContext from "./authStore";

import {
  loginStaff,
  verifyPatientOtp,
  getCurrentUser,
  logoutUser,
} from "../services/authService";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem(TOKEN_KEY) || ""
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

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

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(response.user)
        );

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

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(response.user)
    );

    setUser(response.user);

    return response.user;
  };

  // ==========================================
  // Patient Login
  // ==========================================

  const patientLogin = async (email, otp) => {
    const response = await verifyPatientOtp(email, otp);

    localStorage.setItem(TOKEN_KEY, response.token);

    setToken(response.token);

    // Patient Login doesn't return User
    // Fetch authenticated user

    const currentUser = await getCurrentUser();

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(currentUser.user)
    );

    setUser(currentUser.user);

    return currentUser.user;
  };

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    logoutUser();

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken("");

    setUser(null);
  };

  // ==========================================
  // Context Value
  // ==========================================

  const value = useMemo(
    () => ({
      loading,

      token,

      user,

      isAuthenticated: !!token,

      role: user?.role || "",

      email: user?.email || "",

      staffLogin,

      patientLogin,

      logout,
    }),
    [loading, token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// import { useMemo, useState } from "react";
// import AuthContext from "./authStore";
// import { createPatientSession, createStaffSession } from "../services/authService";

// const AUTH_STORAGE_KEY = "clinicconnect-auth";
// const getStoredSession = () => {
//   try {
//     return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY)) || null;
//   } catch {
//     return null;
//   }
// };

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(getStoredSession);

//   const value = useMemo(() => ({
//     email: session?.user.email || "",
//     isAuthenticated: Boolean(session?.token),
//     role: session?.user.role || "",
//     token: session?.token || "",
//     user: session?.user || null,
//     login: ({ email, mobile, role }) => {
//       const nextSession = role === "Patient"
//         ? createPatientSession({ mobile })
//         : createStaffSession({ email, role });

//       window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
//       setSession(nextSession);
//       return nextSession;
//     },
//     logout: () => {
//       window.localStorage.removeItem(AUTH_STORAGE_KEY);
//       setSession(null);
//     },
//   }), [session]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
