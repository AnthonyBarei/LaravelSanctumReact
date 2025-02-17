import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const PrivateRoutes = ({ children }) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default PrivateRoutes;
