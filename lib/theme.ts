// Create a theme instance.
import { createTheme, PaletteMode, Theme } from '@mui/material';
import { orange } from '@mui/material/colors';

const mode: PaletteMode = 'light';

const getDesignTokens = (mode: PaletteMode): Theme => ({
  palette: {
    // TODO: Fix types
    // @ts-ignore
    primary: orange,
    mode,
    // @ts-ignore
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
          borderRadius: '1rem'
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
    MuiListItem: {
      styleOverrides: {
        button: {
          borderRadius: '0.625rem',
          overflow: 'hidden'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '1rem'
        }
      }
    }
  }
});

export default createTheme(getDesignTokens(mode));
