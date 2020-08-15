import express, { Application, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { render } from "./PageRenderer";
import Backend from "i18next-fs-backend";
import { initReactI18next } from "react-i18next";
import i18nextMiddleware from "i18next-http-middleware";
import i18n, { TFunction } from "i18next";

const app: Application = express();

// Keep a cache of the app index file instead of reading every request.
const index: Buffer = fs.readFileSync(path.join(__dirname, "public/index.html"));

app.use("/public", express.static(path.resolve("public")));
app.use("/locales", express.static(path.resolve("public/locales")));

app.use(i18nextMiddleware.handle(i18n));

app.get("/ping", async (req: Request, res: Response) => {
  res.send("ping!");
});

// All js files are returned as .js.gz to minimize load times.
app.get("*.js", async (req, res, next) => {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

// For now, send all routing to the client.
app.get("*", async (req: Request, res: Response) => {
  const page = await render(req, index);
  res.cookie("i18next", (req as any).language, { secure: false, httpOnly: false, maxAge: 600000 });
  res.send(page);
});

i18n
  .use(Backend)
  .use(initReactI18next)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: false,
    preload: ["en", "es", "he", "zh"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: path.resolve("public/locales/{{lng}}/{{ns}}.json"),
      addPath: path.resolve("public/locales/{{lng}}/{{ns}}.miss.json")
    },
    react: {
      useSuspense: false,
      wait: true
    },
    initImmediate: false
  })
  .then((t: TFunction) => {
    app.listen(3000, () => {
      console.log("Web server listening on port 3000");
    });
  })
  .catch(() => {
    console.log("Failed to load locales for application translations.");
    process.exitCode = 1;
  });
