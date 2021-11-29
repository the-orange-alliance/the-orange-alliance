import * as React from 'react';
import { MatchParticipant, Match } from '@the-orange-alliance/api/lib/cjs/models';
import MatchStations from '@the-orange-alliance/api/lib/cjs/models/types/MatchStations';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { colorCalc } from '../lib/utils/common';

interface IProps {
  match: Match;
  header?: boolean;
}

const SimpleMatchTable = (props: IProps) => {
  const { match, header = true } = props;

  const renderRedAlliance = (match: Match) => {
    const { participants } = match;
    const redAlliance: MatchParticipant[] = participants.filter(
      (p: MatchParticipant) => p.station < MatchStations.Blue1
    );
    const redView = redAlliance.map((p: MatchParticipant) => {
      return (
        <TableCell key={p.matchParticipantKey} align="center">
          <Typography
            variant={'body1'}
            style={{ fontWeight: match.blueScore < match.redScore ? 'bolder' : 'normal' }}
          >
            {p.teamKey}
          </Typography>
        </TableCell>
      );
    });
    return (
      <TableRow
        style={{
          backgroundColor: colorCalc(false, 'red', match.redScore > match.blueScore)
        }}
      >
        {redView}
        <TableCell align="center">
          <Typography
            variant={'body1'}
            style={{ fontWeight: match.blueScore < match.redScore ? 'bolder' : 'normal' }}
          >
            {match.redScore}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  const renderBlueAlliance = (match: Match) => {
    const { participants } = match;
    const blueAlliance: MatchParticipant[] = participants.filter(
      (p: MatchParticipant) => p.station >= MatchStations.Blue1
    );
    const blueView = blueAlliance.map((p: MatchParticipant) => {
      return (
        <TableCell key={p.matchParticipantKey} align="center">
          <Typography
            variant={'body1'}
            style={{ fontWeight: match.blueScore > match.redScore ? 'bolder' : 'normal' }}
          >
            {p.teamKey}
          </Typography>
        </TableCell>
      );
    });
    return (
      <TableRow
        style={{
          backgroundColor: colorCalc(false, 'blue', match.redScore < match.blueScore)
        }}
      >
        {blueView}
        <TableCell align="center">
          <Typography
            variant={'body1'}
            style={{ fontWeight: match.blueScore > match.redScore ? 'bolder' : 'normal' }}
          >
            {match.blueScore}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          {header ? (
            <TableHead style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
              <TableRow>
                <TableCell align="center" colSpan={match.participants.length > 4 ? 3 : 2}>
                  <Typography variant={'subtitle1'}>Teams</Typography>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <Typography variant={'subtitle1'}>Scores</Typography>
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
};

export default SimpleMatchTable;
