import * as React from "react";
import SimpleMatchTable from "../components/SimpleMatchTable";
import Match from "@the-orange-alliance/api/lib/cjs/models/Match";
import {useTranslate} from "../i18n/i18n";
import {Card, CardContent, CardHeader, Divider, Typography} from "@mui/material";

interface IProps {
  quals: Match,
  elims: Match,
  overall: Match
}

const LeaderboardsModule = ({ quals, elims, overall }: IProps) => {
  const t = useTranslate();

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
          overall
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {renderMatch(
          t("pages.home.leaderboards.high_score_qual"),
          `(${t("pages.home.leaderboards.penalty_free")})`,
          quals
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {renderMatch(
          t("pages.home.leaderboards.high_score_elim"),
          `(${t("pages.home.leaderboards.penalty_free")})`,
          elims
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardsModule;
