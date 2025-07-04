import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomAppTitle from './CustomAppTitle';
import SidebarFooterAccountPopover from './SideBarFooterAccount';
import { Box, Typography } from '@mui/material';
import Copyright from './Copyright';

export default function Layout() {
  return (
    <DashboardLayout slots={{
        appTitle: CustomAppTitle,
        toolbarAccount: () => null,
        sidebarFooter: SidebarFooterAccountPopover
    }}>
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Box textAlign="center" py={1}>
        <Typography variant="caption" color="textSecondary">
          <Copyright />
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
