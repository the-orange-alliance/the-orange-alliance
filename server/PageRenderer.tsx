import * as React from "react";
import { Request } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import {
  getHomeData,
  IApplicationState,
  IApplicationStateJSON,
  IHomeProps,
  defaultState,
  Reducer,
  ITeamsProps,
  getTeamsData,
  IEventsProps,
  getEventsData
} from "shared";
import App from "../client/App";
import Event from "@the-orange-alliance/api/lib/models/Event";
import Team from "@the-orange-alliance/api/lib/models/Team";
import Match from "@the-orange-alliance/api/lib/models/Match";
import { createStore } from "redux";
import { Provider } from "react-redux";
import MatchParticipant from "@the-orange-alliance/api/lib/models/MatchParticipant";

export async function render(req: Request, file: Buffer): Promise<string> {
  const initialState: IApplicationState = await loadPageData(req, req.params);
  const store = createStore(Reducer, initialState);
  const state: IApplicationState = store.getState();
  const context: any = {};

  const app = React.createElement(App, { store: store });
  const router = React.createElement(StaticRouter, { location: req.url, context: context }, app);
  const fullApp = React.createElement(Provider, { store: store as any }, router);
  const body: string = renderToString(fullApp);

  return file
    .toString()
    .replace("{{{body}}}", body)
    .replace("library.dll.js", "public/library.dll.js")
    .replace("index.js", "public/index.js")
    .replace(`['__REDUX__']`, JSON.stringify(prepareState(state)).replace(/</g, "\\u003c"));
}

function prepareState(state: IApplicationState): IApplicationStateJSON {
  return {
    teamsTotal: state.teamsTotal,
    eventsTotal: state.eventsTotal,
    events: state.events.map((e: Event) => e.toJSON()),
    teams: state.teams.map((t: Team) => t.toJSON()),
    matches: state.matches.map((m: Match) => m.toJSON()),
    highScoreMatches: {
      elims: convertFullMatchToJSON(state.highScoreMatches.elims),
      overall: convertFullMatchToJSON(state.highScoreMatches.overall),
      quals: convertFullMatchToJSON(state.highScoreMatches.quals)
    }
  };
}

async function loadPageData(req: any, params?: any): Promise<IApplicationState> {
  switch (req.path) {
    case "/":
      const defaultHomeProps: IHomeProps = {
        eventSize: 0,
        teamSize: 0,
        highScoreMatches: {
          quals: new Match(),
          overall: new Match(),
          elims: new Match()
        }
      };
      const homeProps: IHomeProps = await getHomeData(defaultHomeProps);
      return {
        ...defaultState,
        eventsTotal: homeProps.eventSize,
        teamsTotal: homeProps.teamSize,
        highScoreMatches: homeProps.highScoreMatches
      };
    case "/teams":
      const defaultTeamsProps: ITeamsProps = { teams: [] };
      const teamsProps: ITeamsProps = await getTeamsData(defaultTeamsProps);
      return {
        ...defaultState,
        teams: teamsProps.teams
      };
    case "/events":
      const defaultEventsProps: IEventsProps = { events: [] };
      const eventsProps: IEventsProps = await getEventsData(defaultEventsProps);
      return {
        ...defaultState,
        events: eventsProps.events
      };
    default:
      return defaultState;
  }
}

function convertFullMatchToJSON(match: Match): any {
  return {
    ...match.toJSON(),
    participants: match.participants.map((p: MatchParticipant) => p.toJSON()),
    event: match.event.toJSON()
  };
}
