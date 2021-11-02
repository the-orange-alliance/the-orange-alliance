import * as React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IApplicationState, TOAProvider, getEventRankings, setEventRankings } from "shared";
import { Ranking } from "@the-orange-alliance/api/lib/models";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const RankingTab = function () {
  const { t } = useTranslation();
  const { eventCode } = useParams<{ eventCode: string }>();
  const dispatch = useDispatch();
  function loadEventRankings() {
    getEventRankings(eventCode).then((rankings: Ranking[]) => {
      dispatch(setEventRankings(rankings));
    });
  }
  const rankings = useSelector((state: IApplicationState) => state.currentEvent.rankings);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("pages.event.subpages.rankings.rank")}</TableCell>
          <TableCell>{t("pages.event.subpages.rankings.team")}</TableCell>
          <TableCell>{t("pages.event.subpages.rankings.ranking_points")}</TableCell>
          <TableCell>{t("pages.event.subpages.rankings.tie_breaker_points")}</TableCell>
          <TableCell>{t("pages.event.subpages.rankings.highest_score")}</TableCell>
          <TableCell>{t("pages.event.subpages.rankings.matches_played")}</TableCell>
          <TableCell>OPR</TableCell>
          <TableCell>NP-OPR</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rankings.map((row: Ranking) => (
          <TableRow>
            <TableCell>{row.rank}</TableCell>
            <TableCell>
              #{row.team.teamNumber} {row.team.teamNameShort}
            </TableCell>
            <TableCell>{row.rankingPoints}</TableCell>
            <TableCell>{row.tieBreakerPoints}</TableCell>
            <TableCell>{row.highestQualScore}</TableCell>
            <TableCell>{row.played}</TableCell>
            <TableCell>{row.opr}</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RankingTab;
