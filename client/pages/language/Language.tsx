import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@material-ui/core";
import { changeLanguage } from "../../i18n";

const LanguagePage = function () {
  const { t } = useTranslation();
  return (
    <div>
      <Typography variant='h4' gutterBottom>
        {t("pages.language.title")}
      </Typography>
      <Button
        onClick={() => {
          changeLanguage("en");
        }}
      >
        English
      </Button>
      <Button
        onClick={() => {
          changeLanguage("es");
        }}
      >
        Spanish
      </Button>
      <Button
        onClick={() => {
          changeLanguage("he");
        }}
      >
        Hebrew
      </Button>
      <Button
        onClick={() => {
          changeLanguage("zh");
        }}
      >
        Chinese
      </Button>
    </div>
  );
};

export default LanguagePage;
