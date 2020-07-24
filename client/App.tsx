import * as React from 'react';
import { Route, Switch } from 'react-router';
import AppTheme from './AppTheme';
import Routes, { IAppRoute } from './AppRoutes';
import AppResponsiveDrawer from './AppResponsiveDrawer';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import './App.scss';

class App extends React.Component {
  private readonly routeComponents: React.ReactElement[];

  public constructor(props: any) {
    super(props);

    this.routeComponents = Routes.map((r: IAppRoute, index: number) => {
      return (
        <Route
          key={`route-${index}`}
          exact={true}
          path={r.to}
          component={r.component}
        />
      );
    });
  }

  public render() {
    return (
      <ThemeProvider theme={AppTheme}>
        <div>
          <AppResponsiveDrawer
            title={'The Orange Alliance'}
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
    );
  }
}

export default App;
