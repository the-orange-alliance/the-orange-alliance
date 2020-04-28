import express, {Application, Request, Response} from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {render} from "./PageRenderer";

const app: Application = express();

// Keep a cache of the app index file instead of reading every request.
const index: Buffer = fs.readFileSync(path.join(__dirname, 'public/index.html'));

app.use('/public', express.static(path.resolve('public')));

app.get('/ping', async (req: Request, res: Response) => {
  res.send('ping!');
});

// All js files are returned as .js.gz to minimize load times.
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

// For now, send all routing to the client.
app.get('*', async (req: Request, res: Response) => {
  res.send(render(req, index));
});

app.listen(3000, () => {
  console.log('Web server listening on port 3000');
});