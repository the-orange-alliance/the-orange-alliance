import * as React from 'react';
import { Request } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { IApplicationState, IApplicationStateJSON } from 'shared';
import App from '../client/App';
import Event from '@the-orange-alliance/api/lib/models/Event';
import Team from '@the-orange-alliance/api/lib/models/Team';
import Match from '@the-orange-alliance/api/lib/models/Match';

export function render(req: Request, file: Buffer): string {
  const app: React.ReactElement = React.createElement(App, {});
  const fullApp: React.ReactElement = React.createElement(
    StaticRouter,
    { location: req.url, context: {} },
    app
  );
  const body: string = renderToString(fullApp);
  return file
    .toString()
    .replace('{{{body}}}', body)
    .replace('index.js', 'public/index.js');
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
