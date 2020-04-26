import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import App from './App';

const isDev: boolean = true;
const fullApp: React.ReactElement = (
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

if (isDev) {
  ReactDOM.render(fullApp, document.getElementById('app'));
} else {
  ReactDOM.hydrate(fullApp, document.getElementById('app'));
}