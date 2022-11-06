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
  TableRow,
  Link
} from '@mui/material';
import { colorCalc } from '../lib/utils/common';
import NextLink from 'next/link';

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
    return (
      <TableRow
        style={{
          backgroundColor: colorCalc(false, 'red', match.redScore > match.blueScore)
        }}
      >
        {redAlliance.map((p: MatchParticipant) => (
          <TableCell key={p.matchParticipantKey} align="center">
            <NextLink href={`/teams/${p.teamKey}`} passHref>
              <Link
                fontWeight={match.blueScore < match.redScore ? 700 : undefined}
                underline="none"
              >
                {p.teamKey}
              </Link>
            </NextLink>
          </TableCell>
        ))}
        <TableCell align="center">
          <Typography fontWeight={match.blueScore < match.redScore ? 700 : undefined}>
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
    return (
      <TableRow
        style={{
          backgroundColor: colorCalc(false, 'blue', match.redScore < match.blueScore)
        }}
      >
        {blueAlliance.map((p: MatchParticipant) => {
          return (
            <TableCell key={p.matchParticipantKey} align="center">
              <NextLink href={`/teams/${p.teamKey}`} passHref>
                <Link
                  fontWeight={match.blueScore > match.redScore ? 700 : undefined}
                  underline="none"
                >
                  {p.teamKey}
                </Link>
              </NextLink>
            </TableCell>
          );
        })}
        <TableCell align="center">
          <Typography fontWeight={match.blueScore > match.redScore ? 700 : undefined}>
            {match.blueScore}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              padding: '0.675rem'
            },
            '& .MuiTableRow-root:last-child .MuiTableCell-root': {
              borderBottom: 'none'
            }
          }}
        >
          {header ? (
            <TableHead style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
              <TableRow>
                <TableCell align="center" colSpan={match.participants.length > 4 ? 3 : 2}>
                  <Typography>Teams</Typography>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <Typography>Scores</Typography>
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
