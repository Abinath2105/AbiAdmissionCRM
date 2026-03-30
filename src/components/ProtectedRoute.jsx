import React from "react";
import { Navigate } from "react-router-dom"; // ✅ correct place
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { role } = useAuth();

  // 🔐 Not logged in → redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (!allowedRoles.includes(role)) {
    return <h3>Access Denied</h3>;
  }

  // ✅ Allowed
  return children;
}