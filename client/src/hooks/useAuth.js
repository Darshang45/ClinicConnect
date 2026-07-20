import { useContext } from "react";
import AuthContext from "../context/authStore";

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  return context;
}

export default useAuth;
