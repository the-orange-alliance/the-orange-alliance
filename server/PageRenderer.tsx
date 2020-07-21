import * as React from 'react';
import { Request } from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from '../client/App';

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
