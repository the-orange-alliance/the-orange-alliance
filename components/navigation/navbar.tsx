import { AppBar, Backdrop, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { useTranslate } from '../../i18n/i18n';
import { useTheme } from '@mui/material/styles';
import { Search as SearchIcon } from '@mui/icons-material';
import Search from './search';

interface NavbarProps {
  title: string;
  isDrawerOpen: boolean;
  handleDrawerToggle?: () => void;
}

const Navbar = ({ title, isDrawerOpen, handleDrawerToggle }: NavbarProps) => {
  const t = useTranslate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isSmallScreen) {
      setIsMobileSearchOpen(false);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    if (isMobileSearchOpen) {
      const searchInput = document.querySelector('input#toa-search') as HTMLInputElement;
      if (searchInput) searchInput?.focus();
    }
  }, [isMobileSearchOpen]);

  return (
    <>
      <AppBar elevation={0} position="fixed">
        <Toolbar>
          {!isMobileSearchOpen && (
            <>
              <IconButton
                color="inherit"
                aria-label={isDrawerOpen ? 'Close drawer' : 'Open drawer'}
                edge="start"
                onClick={handleDrawerToggle || undefined}
                sx={{ display: handleDrawerToggle ? 'flex' : 'none', mr: 2 }}
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
                {title}
              </Typography>
            </>
          )}
          {isSmallScreen && !isMobileSearchOpen ? (
            <IconButton
              color="inherit"
              aria-label="Show Search"
              edge="start"
              onClick={() => setIsMobileSearchOpen(true)}
              size="large"
            >
              <SearchIcon />
            </IconButton>
          ) : (
            <Search
              sx={isSmallScreen ? { flexGrow: 1 } : { width: '18rem' }}
              variant="navbar"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setIsSearchFocused(false);
                setIsMobileSearchOpen(false);
              }}
              showIcon
              showDescription
              maxResults={6}
              watchGlobalCommand
            />
          )}
        </Toolbar>
      </AppBar>
      <Backdrop
        open={isSearchFocused}
        sx={{
          zIndex: 1302,
          backgroundColor: 'rgba(0, 0, 0, 0.36)'
        }}
      />
    </>
  );
};

export default Navbar;
