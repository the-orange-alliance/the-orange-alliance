// Create a theme instance.
import { createTheme, PaletteMode, Shadows, Theme } from '@mui/material';
import { orange } from '@mui/material/colors';

const mode: PaletteMode = 'light';

const getDesignTokens = (mode: PaletteMode): Theme => ({
  colorSchemes: {
    dark: {
      palette: {
        primary: orange,
        secondary: {
          main: '#06c'
        }
      }
    }
  },
  palette: {
    // TODO: Fix types
    // @ts-ignore
    primary: orange,
    mode,
    // @ts-ignore
    secondary: {
      main: '#06c'
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f6f7',
      paper: mode === 'dark' ? '#1a1a1a' : '#ffffff'
    },
    info: {
      contrastText: '#fff',
      dark: '#06c',
      light: '#06c',
      main: '#06c'
    }
  },
  shape: {
    borderRadius: 8
  },
  // @ts-ignore
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '2.25rem'
      }
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500
    }
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
  zIndex: {
    appBar: 1304,
    drawer: 1310,
    fab: 1050,
    mobileStepper: 1000,
    modal: 1320,
    snackbar: 1400,
    speedDial: 1050,
    tooltip: 1500
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'always',
        color: 'inherit'
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.875rem'
        }
      },
      defaultProps: {
        elevation: 2
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
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '0.75rem'
        }
      }
    }
  }
});

export default createTheme(getDesignTokens(mode));
