import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface NavbarProps {
  title: string;
  isDrawerOpen: boolean;
  handleDrawerToggle?: () => void;
}

const Navbar = ({ title, isDrawerOpen, handleDrawerToggle }: NavbarProps) => {
  return (
    <AppBar elevation={0} position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
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
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
