import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { useSSR } from "react-i18next";
import "./i18n";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { Reducer as reducer, defaultState, IApplicationState, IApplicationStateJSON } from "shared";
import Event from "@the-orange-alliance/api/lib/esm/models/Event";
import Team from "@the-orange-alliance/api/lib/esm/models/Team";
import Match from "@the-orange-alliance/api/lib/esm/models/Match";
import { BrowserRouter } from "react-router-dom";

const stateCache: IApplicationStateJSON = (window as any).__REDUX_STATE_CACHE__;
delete (window as any).__REDUX_STATE_CACHE__;
const state: IApplicationState = defaultState;

// Since we made the state cache an array, if it's no longer an array we know the server provided data.
if (!Array.isArray(stateCache)) {
  convertCacheToState(state, stateCache);
}

// MAKE SURE THIS VARIABLE IS SET CORRECTLY - TODO: Have CI handle this? Post-build?
const isDev = false;
const store = createStore(reducer, state);

function FullApp() {
  // If our english translation store exists, use the i18n cache.
  if ((window as any).initialI18nStore?.en) {
    useSSR((window as any).initialI18nStore, (window as any).initialLanguage);
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={<div></div>}>
          <App />
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
}

if (isDev) {
  ReactDOM.render(<FullApp />, document.getElementById("app"));
} else {
  ReactDOM.hydrate(<FullApp />, document.getElementById("app"));
}

function convertCacheToState(state: IApplicationState, stateJSON: IApplicationStateJSON): void {
  if (stateJSON.teamsTotal > 0) state.teamsTotal = stateJSON.teamsTotal;
  if (stateJSON.eventsTotal > 0) state.eventsTotal = stateJSON.eventsTotal;
  if (stateJSON.matchesTotal > 0) state.matchesTotal = stateJSON.matchesTotal;
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
