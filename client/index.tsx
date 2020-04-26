import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const isDev: boolean = false;

if (isDev) {
  ReactDOM.render(<App/>, document.getElementById('app'));
} else {
  ReactDOM.hydrate(<App/>, document.getElementById('app'));
}