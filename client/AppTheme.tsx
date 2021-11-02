import { adaptV4Theme, createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: orange,
      secondary: {
        main: "#0f0f0f"
      }
    }
  })
);

export default theme;
