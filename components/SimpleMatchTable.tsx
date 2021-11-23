import * as React from "react";
import {MatchParticipant, Match} from "@the-orange-alliance/api/lib/cjs/models";
import MatchStations from "@the-orange-alliance/api/lib/cjs/models/types/MatchStations";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

interface IProps {
  match: Match;
  header?: boolean;
}

const SimpleMatchTable = (props: IProps) => {

  const {match, header = true} = props;

  const renderRedAlliance = (match: Match) => {
    const {participants} = match;
    const redAlliance: MatchParticipant[] = participants.filter(
      (p: MatchParticipant) => p.station < MatchStations.Blue1
    );
    const redView = redAlliance.map((p: MatchParticipant) => {
      return (
        <TableCell key={p.matchParticipantKey} align='center'>
          <Button fullWidth color={"secondary"}>
            {p.teamKey}
          </Button>
        </TableCell>
      );
    });
    return (
      <TableRow className={"red-bg"}>
        {redView}
        <TableCell>
          <Button fullWidth color={"secondary"}>
            {match.redScore}
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  const renderBlueAlliance = (match: Match) => {
    const {participants} = match;
    const blueAlliance: MatchParticipant[] = participants.filter(
      (p: MatchParticipant) => p.station >= MatchStations.Blue1
    );
    const blueView = blueAlliance.map((p: MatchParticipant) => {
      return (
        <TableCell key={p.matchParticipantKey} align='center'>
          <Button fullWidth color={"secondary"}>
            {p.teamKey}
          </Button>
        </TableCell>
      );
    });
    return (
      <TableRow className={"blue-bg"}>
        {blueView}
        <TableCell>
          <Button fullWidth color={"secondary"}>
            {match.blueScore}
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={"simple-match-table"}>
          {header ? (
            <TableHead className={"grey-bg"}>
              <TableRow>
                <TableCell align='center' colSpan={match.participants.length > 4 ? 3 : 2}>
                  Teams
                </TableCell>
                <TableCell align='center' colSpan={1}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {renderRedAlliance(match)}
            {renderBlueAlliance(match)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SimpleMatchTable;
