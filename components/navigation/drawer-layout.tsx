import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Drawer, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from './navbar';
import DrawerContent from './drawer-content';
import TOAUser from '../../lib/TOAUser';
import {
  getAuthInstance,
  getUserData,
  inStartupState,
  isLoggedIn
} from '../../providers/FirebaseProvider';
import { onAuthStateChanged } from 'firebase/auth';

const DRAWER_WIDTH = 240;

interface DrawerLayoutProps {
  title: string;
  children: React.ReactNode;
}

const DrawerLayout = ({ title, children }: DrawerLayoutProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [user, setUser] = useState<TOAUser>();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    onAuthStateChanged(getAuthInstance(), user => {
      if (user) {
        getUser();
      } else {
        setUser(undefined);
      }
    });
    if (!inStartupState() || isLoggedIn()) {
      getUser();
    }
  }, []);

  const getUser = () => {
    getUserData().then(user => {
      setUser(user);
    });
  };

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
          <DrawerContent toaUser={user} />
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
