import * as React from "react";
import { Route, Switch } from "react-router-dom";
import AppTheme from "./AppTheme";
import Routes, { IAppRoute } from "./AppRoutes";
import AppResponsiveDrawer from "./AppResponsiveDrawer";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";

import "./App.scss";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

class App extends React.Component {
  private readonly routeComponents: React.ReactElement[];

  public constructor(props: any) {
    super(props);

    this.routeComponents = Routes.map((r: IAppRoute, index: number) => {
      return <Route key={`route-${index}`} exact={true} path={r.to} component={r.component} />;
    });
  }

  public render() {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={AppTheme}>
          <div>
            <AppResponsiveDrawer
              title={"The Orange Alliance"}
              routes={Routes}
              content={
                <div>
                  <Container maxWidth={false}>
                    <Switch>{this.routeComponents}</Switch>
                  </Container>
                </div>
              }
            />
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
