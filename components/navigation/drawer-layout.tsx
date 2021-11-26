import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Box, Drawer, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslate } from '../../i18n/i18n';
import Navbar from './navbar';
import DrawerContent from './drawer-content';

const DRAWER_WIDTH = 240;

interface DrawerLayoutProps {
  title: string;
  children: React.ReactNode;
}

const DrawerLayout = ({ title, children }: DrawerLayoutProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const temporaryDrawer = useMemo(
    () => smallScreen || ['/live'].includes(router.route),
    [smallScreen, router.route]
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        title={title}
        handleDrawerToggle={temporaryDrawer ? handleDrawerToggle : undefined}
        isDrawerOpen={mobileOpen}
      />

      <Box sx={{ flexShrink: 0 }}>
        <Drawer
          variant={temporaryDrawer ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            width: DRAWER_WIDTH,
            [`& .MuiDrawer-paper`]: {
              width: DRAWER_WIDTH
            }
          }}
        >
          <Toolbar />
          <DrawerContent />
        </Drawer>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DrawerLayout;
