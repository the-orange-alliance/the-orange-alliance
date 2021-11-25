import * as React from 'react';
import { Match, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import { TableRow, TableCell, Grid, Button, Typography, Box, GridSize } from '@mui/material';
import IconPlay from '@mui/icons-material/PlayCircleOutline';
import { useState } from 'react';
import { CURRENT_SEASON } from '../constants';

interface IProps {
  match: Match;
  forceSmall?: boolean;
  selectedTeam?: MatchParticipant | null;
  setSelectedTeam?: (participant: MatchParticipant | null) => void;
}

const MatchTable = ({ match, forceSmall, selectedTeam, setSelectedTeam }: IProps) => {
  const sideBySideSx = forceSmall
    ? { display: 'none' }
    : { display: { xs: `none`, md: 'table-row' } };
  const stackedSx = forceSmall
    ? { display: 'table-row' }
    : { display: { xs: 'table-row', md: 'none' } };

  return (
    <>
      {/* SIDE-BY-SIDE ALLIANCES */}
      <TableRow sx={sideBySideSx}>
        <TableCell className={'p-0'} padding={'none'}>
          <Typography align="center">{match.matchName}</Typography>
        </TableCell>
        <TableCell>
          {match.videoURL ? (
            <a href={match.videoURL} target={'_blank'} rel={'noreferrer'}>
              <IconPlay />
            </a>
          ) : (
            <IconPlay color={'disabled'} />
          )}
        </TableCell>
        <TableCell padding={'none'}>
          <Grid container>
            <MatchTeamDisplay
              match={match}
              color="red"
              win={match.redScore > match.blueScore}
              setSelectedTeam={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
          </Grid>
        </TableCell>
        <TableCell padding={'none'}>
          <Grid container>
            <MatchTeamDisplay
              match={match}
              color="blue"
              win={match.redScore < match.blueScore}
              setSelectedTeam={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
          </Grid>
        </TableCell>
        <TableCell padding={'none'}>
          <Grid container>
            <MatchScoreDisplay
              score={match.redScore}
              color="red"
              win={match.redScore > match.blueScore}
            />
          </Grid>
        </TableCell>
        <TableCell padding={'none'}>
          <Grid container>
            <MatchScoreDisplay
              score={match.blueScore}
              color="blue"
              win={match.redScore < match.blueScore}
            />
          </Grid>
        </TableCell>
      </TableRow>

      {/* STACKED ALLIANCES */}
      <TableRow sx={stackedSx}>
        <TableCell>
          <Typography align="center">{match.matchName}</Typography>
        </TableCell>
        <TableCell>
          {match.videoURL ? (
            <a href={match.videoURL}>
              <IconPlay />
            </a>
          ) : (
            <IconPlay color={'disabled'} />
          )}
        </TableCell>
        <TableCell padding={'none'}>
          <Grid container>
            <MatchTeamDisplay
              match={match}
              color="red"
              win={match.redScore > match.blueScore}
              setSelectedTeam={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
            <MatchTeamDisplay
              match={match}
              color="blue"
              win={match.redScore < match.blueScore}
              setSelectedTeam={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
          </Grid>
        </TableCell>
        <TableCell padding={'none'}>
          <Grid container>
            <MatchScoreDisplay
              score={match.redScore}
              color="red"
              win={match.redScore > match.blueScore}
            />
            <MatchScoreDisplay
              score={match.blueScore}
              color="blue"
              win={match.redScore < match.blueScore}
            />
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
};

const MatchTeamDisplay = ({
  match,
  color,
  win,
  setSelectedTeam,
  selectedTeam
}: {
  match: Match;
  color: string;
  win: boolean;
  setSelectedTeam?: (participant: MatchParticipant | null) => void;
  selectedTeam?: MatchParticipant | null;
}) => {
  const teamCount = match.participants.length;
  const startPos = color === 'red' ? 0 : teamCount / 2;
  const teams = match.participants.slice(startPos, startPos + teamCount / 2);

  const selectTeam = (team: MatchParticipant) => {
    if (
      (setSelectedTeam && selectedTeam && selectedTeam.teamKey !== team.teamKey) ||
      !selectedTeam
    ) {
      setSelectedTeam && setSelectedTeam(team);
    } else if (setSelectedTeam && selectedTeam && selectedTeam.teamKey === team.teamKey) {
      setSelectedTeam(null);
    }
  };

  const getHref = (teamKey: string) => {
    const seasonKey = match.matchKey.split('-')[0];
    if (seasonKey !== CURRENT_SEASON) {
      return `/teams/${teamKey}?season_key=${seasonKey}`;
    } else {
      return `/teams/${teamKey}`;
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        {teams.map((team: MatchParticipant) => (
          <Grid
            key={team.teamKey}
            item
            xs={(24 / teamCount) as 3 | 4}
            className={`${selectedTeam?.teamKey === team.teamKey ? 'selected' : color}-bg${
              win ? ' win' : ''
            }`}
            onClick={() => selectTeam(team)}
          >
            <Box className={'text-center'} style={{ padding: '17px' }} color={'inherit'}>
              <a className={`match-table-text ${win ? 'win' : ''}`} href={getHref(team.teamKey)}>
                {team.teamKey}
              </a>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
const MatchScoreDisplay = ({
  score,
  color,
  win
}: {
  score: number;
  color: string;
  win: boolean;
}) => {
  return (
    <Grid item xs={12} className={`${color}-bg${win ? ' win' : ''}`}>
      <Box
        color={'inherit'}
        style={{ padding: '17px' }}
        className={`match-table-text text-center ${win ? 'win' : ''}`}
      >
        {score}
      </Box>
    </Grid>
  );
};

export default MatchTable;
