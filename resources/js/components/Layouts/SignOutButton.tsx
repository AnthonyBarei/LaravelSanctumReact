import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../../AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const SignOutButton = () => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outlined" color="primary" size="small" startIcon={<LogoutIcon />}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
