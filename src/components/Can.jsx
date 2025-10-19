import React from 'react';
import { useAuth } from '../context/AuthContext';

const Can = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !user.role || !user.role.name) {
    return null;
  }
  const isAllowed = allowedRoles.includes(user.role.name);

  return isAllowed ? <>{children}</> : null;
};

export default Can;