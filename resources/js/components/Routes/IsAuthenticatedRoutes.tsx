import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const IsAuthenticatedRoutes = ({ children }) => {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default IsAuthenticatedRoutes;
