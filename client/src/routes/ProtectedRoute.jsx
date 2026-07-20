import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ allowedRoles, loginPath = "/login/staff" }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate replace to={loginPath} />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate replace to={loginPath} />;

  return <Outlet />;
}

export default ProtectedRoute;
