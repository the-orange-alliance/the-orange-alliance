import { createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: orange,
    // mode:"dark", // TODO????
    secondary: {
      main: "#0f0f0f"
    }
  }
});

export default theme;
