import React from 'react';
import { Avatar, Divider, ListItemIcon, ListItemText, MenuList, MenuItem, Stack, Typography } from '@mui/material';
import { useAuth } from '../../AuthContext';
import SignOutButton from './SignOutButton';

const SidebarFooterAccountPopover = () => {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  const account = {
    id: session.id,
    name: session.name,
    email: session.email,
    image: '', // Add image if available in User type
    color: 'primary', // You can customize the color if needed
  };

  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Account
      </Typography>
      <MenuList>
        <MenuItem
          key={account.id}
          component="button"
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            columnGap: 2,
          }}
        >
          <ListItemIcon>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.95rem',
                bgcolor: account.color,
              }}
              src={account.image ?? ''}
              alt={account.name ?? ''}
            >
              {account.name ? account.name[0] : ''}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
            primary={account.name}
            secondary={account.email}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>
      </MenuList>
      <Divider />
      <Stack direction="row" justifyContent="flex-end" p={1}>
        <SignOutButton />
      </Stack>
    </Stack>
  );
};

export default SidebarFooterAccountPopover;
