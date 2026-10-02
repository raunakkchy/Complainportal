import { Navigate } from "react-router-dom";

export default function PrivateRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/" replace />;
  if (role && role !== currentRole) return <Navigate to="/" replace />;
  return children;
}