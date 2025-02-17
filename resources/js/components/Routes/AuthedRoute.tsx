import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { useAuth, User } from '../../AuthContext';

interface AuthedRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const AuthedRoute = ({ children, adminOnly = false }: AuthedRouteProps) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LinearProgress />;
  }

  if (!session || (adminOnly && !(session as User).is_admin)) {
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AuthedRoute;
