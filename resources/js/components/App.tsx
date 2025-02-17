import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import { AuthProvider, useAuth, User } from '../AuthContext';
import theme from './theme';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
];

const BRANDING = {
  title: "toolpad",
};

const convertUserToSession = (user: User | null): Session | null => {
  if (!user) return null;
  return {
    user: {
      name: user.name || '',
      email: user.email || '',
      image: '', // Add image if available in User type
    },
  };
};

const App = () => {
  const { loading, session } = useAuth();
  const convertedSession = convertUserToSession(session);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={convertedSession}
      theme={theme}
    >
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ReactRouterAppProvider>
  );
};

export default App;
