import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { IHighestScoringMatches } from "shared";

/* Components */
import SimpleMatchTable from "../components/SimpleMatchTable";
import Match from "@the-orange-alliance/api/lib/models/Match";
import { useTranslation } from "react-i18next";

interface IProps {
  highScoreMatches: IHighestScoringMatches;
}

const LeaderboardsModule = function ({ highScoreMatches }: IProps) {
  const { t } = useTranslation();

  function renderMatch(title: string, subtitle: string, match: Match) {
    return (
      <div>
        <Typography variant={"h6"}>{title}</Typography>
        <Typography variant={"subtitle1"} gutterBottom>
          {subtitle}
        </Typography>
        <Typography variant={"h6"}>{match.event?.eventName}</Typography>
        <Typography variant={"subtitle1"}>{match.matchName}</Typography>
        <SimpleMatchTable match={match} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader title={t("pages.home.leaderboards.title")} subheader={"SKYSTONE 2019/20"} />
      <Divider />
      <CardContent>
        {renderMatch(
          t("pages.home.leaderboards.high_score_all"),
          `(${t("pages.home.leaderboards.with_penalties")})`,
          highScoreMatches.overall
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {renderMatch(
          t("pages.home.leaderboards.high_score_qual"),
          `(${t("pages.home.leaderboards.penalty_free")})`,
          highScoreMatches.quals
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {renderMatch(
          t("pages.home.leaderboards.high_score_elim"),
          `(${t("pages.home.leaderboards.penalty_free")})`,
          highScoreMatches.elims
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardsModule;
