import {
  AppBar,
  Autocomplete,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslate } from '../../i18n/i18n';
import { useAppContext } from '../../lib/toa-context';
import { Team, Event, SearchResult } from '@the-orange-alliance/api/lib/cjs/models';
import { useRouter } from 'next/router';
import TOAProvider from '../../providers/TOAProvider';
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
    <AppBar elevation={0} position="fixed" sx={{ zIndex: 1201 }}>
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
            aria-label={'Show Search'}
            edge="start"
            onClick={() => setIsMobileSearchOpen(true)}
            size="large"
          >
            <SearchIcon />
          </IconButton>
        ) : (
          <Search
            sx={isSmallScreen ? { flexGrow: 1 } : { width: '18rem' }}
            onBlur={() => setIsMobileSearchOpen(false)}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
