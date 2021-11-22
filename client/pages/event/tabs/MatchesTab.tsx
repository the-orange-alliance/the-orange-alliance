import * as React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IApplicationState, setEventMatches, getEventMatches } from "shared";
import { Match } from "@the-orange-alliance/api/lib/esm/models";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MatchTable from "../../../components/MatchTable";

const MatchesTab = () => {
  const { t } = useTranslation();
  const { eventCode } = useParams<{ eventCode: string }>();
  const dispatch = useDispatch();
  function loadEventMatches() {
    getEventMatches(eventCode).then((matches: Match[]) => {
      dispatch(setEventMatches(matches));
    });
  }
  const matches = useSelector((state: IApplicationState) => state.currentEvent.matches);

  const qual: Match[] = [];
  const qf: Match[] = [];
  const sf: Match[] = [];
  const f: Match[] = [];
  matches.forEach((match) => {
    if (match.tournamentLevel === 1) {
      qual.push(match);
    } else if (match.tournamentLevel > 20 && match.tournamentLevel < 30) {
      qf.push(match);
    } else if (match.tournamentLevel > 30 && match.tournamentLevel < 40) {
      sf.push(match);
    } else if (match.tournamentLevel === 4) {
      f.push(match);
    }
  });

  function renderTournamentLevel(matches: Match[], translationKey: string) {
    if (matches.length > 0) {
      return (
        <>
          <TableRow>
            <TableCell colSpan={4}>
              <Typography variant='h6' align='center'>
                {t(translationKey)}
              </Typography>
            </TableCell>
          </TableRow>
          {...matches.map((match: Match) => <MatchTable match={match} />)}
        </>
      );
    }
    return null;
  }

  return (
    <Table className='event-match-table'>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography align='center'>{t("match_table.match")}</Typography>
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <Typography align='center'>{t("match_table.red_alliance")}</Typography>
            <Typography align='center'>{t("match_table.blue_alliance")}</Typography>
          </TableCell>
          <TableCell>
            <Typography align='center'>{t("match_table.red_score")}</Typography>
            <Typography align='center'>{t("match_table.blue_score")}</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {renderTournamentLevel(f, "match_table.levels.finals")}
        {renderTournamentLevel(sf, "match_table.levels.semifinals")}
        {renderTournamentLevel(qf, "match_table.levels.quarterfinals")}
        {renderTournamentLevel(qual, "match_table.levels.qualifications")}
      </TableBody>
    </Table>
  );
};

export default MatchesTab;
