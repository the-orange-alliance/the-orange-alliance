import * as React from 'react';
import { Request } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {
  getHomeData,
  IApplicationState,
  IApplicationStateJSON,
  IHomeProps,
  defaultState,
  Reducer
} from 'shared';
import App from '../client/App';
import Event from '@the-orange-alliance/api/lib/models/Event';
import Team from '@the-orange-alliance/api/lib/models/Team';
import Match from '@the-orange-alliance/api/lib/models/Match';
import { createStore } from 'redux';

export async function render(req: Request, file: Buffer): Promise<string> {
  const app: React.ReactElement = React.createElement(App, {});
  const initialState: IApplicationState = await loadPageData(req, req.params);
  const store = createStore(Reducer, initialState);
  const state: IApplicationState = store.getState();
  const fullApp: React.ReactElement = React.createElement(
    StaticRouter,
    { location: req.url, context: {} },
    app
  );
  const body: string = renderToString(fullApp);
  return file
    .toString()
    .replace('{{{body}}}', body)
    .replace('index.js', 'public/index.js')
    .replace(
      `['__REDUX__']`,
      JSON.stringify(prepareState(state)).replace(/</g, '\\u003c')
    );
}

function prepareState(state: IApplicationState): IApplicationStateJSON {
  return {
    teamsTotal: state.teamsTotal,
    eventsTotal: state.eventsTotal,
    events: state.events.map((e: Event) => e.toJSON()),
    teams: state.teams.map((t: Team) => t.toJSON()),
    matches: state.matches.map((m: Match) => m.toJSON()),
    highScoreMatches: {
      elims: state.highScoreMatches.elims.toJSON(),
      overall: state.highScoreMatches.overall.toJSON(),
      quals: state.highScoreMatches.quals.toJSON()
    }
  };
}

async function loadPageData(
  req: any,
  params?: any
): Promise<IApplicationState> {
  switch (req.path) {
    case '/':
      const defaultProps: IHomeProps = {
        eventSize: 0,
        teamSize: 0,
        highScoreMatches: {
          quals: new Match(),
          overall: new Match(),
          elims: new Match()
        }
      };
      const props: IHomeProps = await getHomeData(defaultProps);
      return {
        ...defaultState,
        eventsTotal: props.eventSize,
        teamsTotal: props.teamSize,
        highScoreMatches: props.highScoreMatches
      };
    default:
      return defaultState;
  }
}
