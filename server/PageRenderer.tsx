import * as React from "react";
import { Request } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "../client/App";
import { createStore } from "redux";
import { Reducer, defaultState } from "shared";
import { Provider } from "react-redux";

export function render(req: Request, file: Buffer): string {
  const context: any = {};
  const store = createStore(Reducer, defaultState);

  const app = React.createElement(App, { store: store });
  const router = React.createElement(StaticRouter, { location: req.url, context: context }, app);
  const fullApp = React.createElement(Provider, { store: store as any }, router);

  const body: string = renderToString(fullApp);
  return file
    .toString()
    .replace("{{{body}}}", body)
    .replace("library.dll.js", "public/library.dll.js")
    .replace("index.js", "public/index.js");
}
