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

const stateCache: IApplicationStateJSON = (window as any).__REDUX_STATE_CACHE__;
delete (window as any).__REDUX_STATE_CACHE__;
const state: IApplicationState = defaultState;

// Since we made the state cache an array, if it's no longer an array we know the server provided data.
if (!Array.isArray(stateCache)) {
  convertCacheToState(state, stateCache);
}

// MAKE SURE THIS VARIABLE IS SET CORRECTLY - TODO: Have CI handle this? Post-build?
const isDev: boolean = false;
const store = createStore(reducer, state);
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

function convertCacheToState(state: IApplicationState, stateJSON: IApplicationStateJSON): void {
  if (stateJSON.teamsTotal > 0) state.teamsTotal = stateJSON.teamsTotal;
  if (stateJSON.eventsTotal > 0) state.eventsTotal = stateJSON.eventsTotal;
  if (stateJSON.teams.length > 0) state.teams = stateJSON.teams.map((e: any) => new Team().fromJSON(e));
  if (stateJSON.events.length > 0) state.events = stateJSON.events.map((e: any) => new Event().fromJSON(e));
  if (stateJSON.matches.length > 0) state.matches = stateJSON.matches.map((e: any) => new Match().fromJSON(e));
  state.highScoreMatches.elims = new Match().fromJSON(stateJSON.highScoreMatches.elims);
  state.highScoreMatches.elims.event = new Event().fromJSON(stateJSON.highScoreMatches.elims.event);
  state.highScoreMatches.quals = new Match().fromJSON(stateJSON.highScoreMatches.quals);
  state.highScoreMatches.quals.event = new Event().fromJSON(stateJSON.highScoreMatches.quals.event);
  state.highScoreMatches.overall = new Match().fromJSON(stateJSON.highScoreMatches.overall);
  state.highScoreMatches.overall.event = new Event().fromJSON(stateJSON.highScoreMatches.overall.event);
}
