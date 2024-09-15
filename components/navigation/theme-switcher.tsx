import { IconButton } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';

const ThemeSwitcher = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const currentMode = mode === 'system' ? systemMode : mode;
  return (
    <IconButton
      color="inherit"
      // aria-label={mode === 'dark' ? 'Close drawer' : 'Open drawer'}
      edge="start"
      onClick={() => setMode(currentMode === 'dark' ? 'light' : 'dark')}
      sx={{ ml: 1 }}
    >
      {currentMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeSwitcher;
