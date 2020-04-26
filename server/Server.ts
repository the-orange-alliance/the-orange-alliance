import * as React from 'react';
import {renderToString} from 'react-dom/server';
import express, {Application, Request, Response} from 'express';
import * as path from 'path';
import * as fs from 'fs';
import App from '../client/App';

const app: Application = express();

// Keep a cache of the app index file instead of reading every request.
const index: Buffer = fs.readFileSync(path.join(__dirname, 'public/index.html'));

app.use('/public', express.static(path.resolve('public')));
app.use('/', express.static(path.resolve('public')));

app.get('/ping', (req: Request, res: Response) => {
  res.send('ping!');
});

app.get('/test', (req: Request, res: Response) => {
  const body: string = renderToString(React.createElement(App, {}));
  const data: string = index.toString().replace('{{{body}}}', body);
  res.send({partial: body, full: data});
});

app.get('/', (req: Request, res: Response) => {
  const body: string = renderToString(React.createElement(App, {}));
  res.send(index.toString().replace('{{{body}}}', body));
});

app.listen(3000, () => {
  console.log('Web server listening on port 3000');
});