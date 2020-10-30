import * as React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const UploadPage = function () {
  const { t } = useTranslation();
  return (
    <div>
      <Typography variant='h2'>Upload data</Typography>
    </div>
  );
};

export default UploadPage;
