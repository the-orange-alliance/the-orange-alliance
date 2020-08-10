import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import App from './App';
import { Reducer as reducer, defaultState, IApplicationState } from 'shared';

// TODO - Determine if we received the state from the server.
const state: IApplicationState = defaultState;

// MAKE SURE THIS VARIABLE IS SET CORRECTLY - TODO: Have CI handle this? Post-build?
const isDev: boolean = false;
const store = createStore(reducer, state);
const fullApp: React.ReactElement = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

if (isDev) {
  ReactDOM.render(fullApp, document.getElementById('app'));
} else {
  ReactDOM.hydrate(fullApp, document.getElementById('app'));
}
