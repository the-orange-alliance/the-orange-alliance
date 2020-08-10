import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import "./i18n";
import App from "./App";
import { Reducer as reducer, defaultState, IApplicationState, IApplicationStateJSON } from "shared";
import Event from "@the-orange-alliance/api/lib/models/Event";
import Team from "@the-orange-alliance/api/lib/models/Team";
import Match from "@the-orange-alliance/api/lib/models/Match";

// TODO - Determine if we received the state from the server.
const state: IApplicationState = defaultState;

// MAKE SURE THIS VARIABLE IS SET CORRECTLY - TODO: Have CI handle this? Post-build?
const isDev: boolean = true;
const fullApp: React.ReactElement = (
  <Provider store={createStore(reducer, state)}>
    <BrowserRouter>
      <React.Suspense fallback={<div></div>}>
        <App />
      </React.Suspense>
    </BrowserRouter>
  </Provider>
);

if (isDev) {
  ReactDOM.render(fullApp, document.getElementById("app"));
} else {
  ReactDOM.hydrate(fullApp, document.getElementById("app"));
}
