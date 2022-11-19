// Create a theme instance.
import { createTheme, PaletteMode, Shadows, Theme } from '@mui/material';
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
    borderRadius: 8
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    ...(Array(25 - 6).fill('none') as string[])
  ] as Shadows,
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
        color: 'inherit'
      }
    },
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
    MuiCardHeader: {
      styleOverrides: {
        title: {
          fontSize: '1.125rem',
          fontWeight: 500
        },
        subheader: {
          fontSize: '0.875rem'
        }
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
