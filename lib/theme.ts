// Create a theme instance.
import { createTheme, PaletteMode } from '@mui/material';
import { orange } from '@mui/material/colors';

const mode: PaletteMode = 'light';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    primary: orange,
    mode,
    secondary: {
      main: '#0f0f0f'
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f6f7',
      paper: mode === 'dark' ? '#1a1a1a' : '#ffffff'
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderRadius: 16
        }
      }
    }
  }
});

export default createTheme(getDesignTokens(mode));
