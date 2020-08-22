import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@material-ui/core";
import { changeLanguage } from "../../i18n";
import { useCookies } from "react-cookie";

const LanguagePage = function () {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(["i18next"]);

  const changeCookieAndLanguage = (lang: string) => {
    changeLanguage(lang);
    setCookie("i18next", lang);
  };

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        {t("pages.language.title")}
      </Typography>
      <Button
        onClick={() => {
          changeCookieAndLanguage("en");
        }}
      >
        English
      </Button>
      <Button
        onClick={() => {
          changeCookieAndLanguage("es");
        }}
      >
        Spanish
      </Button>
      <Button
        onClick={() => {
          changeCookieAndLanguage("he");
        }}
      >
        Hebrew
      </Button>
      <Button
        onClick={() => {
          changeCookieAndLanguage("zh");
        }}
      >
        Chinese
      </Button>
    </div>
  );
};

export default LanguagePage;
