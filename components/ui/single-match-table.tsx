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
import NextLink from 'next/link';

interface IProps {
  match: Match;
  header?: boolean;
}

const SimpleMatchTable = (props: IProps) => {
  const { match, header = true } = props;

  const redAlliance: MatchParticipant[] = match.participants.filter(
    (p: MatchParticipant) => p.station < MatchStations.Blue1
  );

  const blueAlliance: MatchParticipant[] = match.participants.filter(
    (p: MatchParticipant) => p.station >= MatchStations.Blue1
  );

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
            <TableHead style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableRow>
                <TableCell align="center" colSpan={match.participants.length > 4 ? 3 : 2}>
                  <Typography fontSize="0.875rem" fontWeight={500}>
                    Teams
                  </Typography>
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  <Typography fontSize="0.875rem" fontWeight={500}>
                    Scores
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            <TableRow style={{ backgroundColor: 'var(--toa-colors-red-transparent)' }}>
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
            <TableRow style={{ backgroundColor: 'var(--toa-colors-blue-transparent)' }}>
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
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SimpleMatchTable;
