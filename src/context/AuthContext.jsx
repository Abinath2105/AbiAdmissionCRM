import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// 🔥 Role-based mock users
const roleUsers = {
  ADMIN: {
    name: "Super Admin",
    email: "admin@college.com"
  },
  OFFICER: {
    name: "Admission Officer",
    email: "officer@college.com"
  },
  MANAGEMENT: {
    name: "Management User",
    email: "management@college.com"
  }
};

export const AuthProvider = ({ children }) => {

  // 🔐 Get role from localStorage
  const storedRole = localStorage.getItem("role");

  const [role, setRole] = useState(storedRole || null);

  // 🔁 Sync role with localStorage
  const updateRole = (newRole) => {
    setRole(newRole);

    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
  };

  // 🔥 Dynamic user based on role
  const user = role ? roleUsers[role] : null;

  return (
    <AuthContext.Provider value={{ role, setRole: updateRole, user }}>
      {children}
    </AuthContext.Provider>
  );
};