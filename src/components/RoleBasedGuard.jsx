import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedGuard = ({ children, requiredRoles = [] }) => {
  const { user } = useAuth();

  // If no roles required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return children;
  }

  const userRole = user?.role?.name;
  const hasAccess = requiredRoles.includes(userRole);

  // If user doesn't have required role, redirect to home
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedGuard;
