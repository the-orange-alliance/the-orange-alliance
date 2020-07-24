import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import orange from '@material-ui/core/colors/orange';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: {
      main: '#0f0f0f'
    }
  }
});

export default theme;
