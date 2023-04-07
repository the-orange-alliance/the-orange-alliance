import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Drawer, SwipeableDrawer, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => setMobileOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  // Close sidebar when not on small screen
  useEffect(() => {
    if (!smallScreen) setMobileOpen(false);
  }, [smallScreen]);

  const disablePermanent = useMemo(() => ['/live'].includes(router.route), [router.route]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        title={title}
        handleDrawerToggle={disablePermanent || smallScreen ? handleDrawerToggle : undefined}
        isDrawerOpen={mobileOpen}
      />

      <Box sx={{ flexShrink: 0 }}>
        {disablePermanent || smallScreen ? (
          <SwipeableDrawer
            disableBackdropTransition={!iOS}
            variant="temporary"
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true
            }}
            sx={theme => ({
              width: DRAWER_WIDTH,
              zIndex: theme.zIndex.appBar - 1,
              [`& .MuiDrawer-paper`]: {
                width: DRAWER_WIDTH
              }
            })}
          >
            <Toolbar />
            <DrawerContent />
          </SwipeableDrawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={theme => ({
              width: DRAWER_WIDTH,
              [`& .MuiDrawer-paper`]: {
                width: DRAWER_WIDTH,
                zIndex: theme.zIndex.appBar - 1
              },
              [theme.breakpoints.up('xs')]: {
                display: 'none'
              },
              [theme.breakpoints.up('md')]: {
                display: 'block'
              }
            })}
          >
            <Toolbar />
            <DrawerContent />
          </Drawer>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
          minWidth: 0,
          maxWidth: '100%'
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DrawerLayout;
