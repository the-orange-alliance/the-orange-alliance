import * as React from "react";
import { useTranslation } from "react-i18next";

const AboutPage = function () {
  const { t } = useTranslation();
  return <div>{t("pages.about.title")}</div>;
};

export default AboutPage;
