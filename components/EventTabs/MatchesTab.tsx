import * as React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Grid,
  Button
} from '@mui/material';
import { Match, Event, Ranking, Team } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import MatchTable from '../MatchTable';
import IconPlay from '@mui/icons-material/PlayCircleOutline';
import { ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { CURRENT_SEASON } from '../../constants';

interface IProps {
  event: Event;
  forceSmall?: boolean;
  disableSingleTeamTeam?: boolean;
}

const MatchesTab = (props: IProps) => {
  const router = useRouter();
  const { forceSmall } = props;
  const { matches } = props.event;
  const t = useTranslate();

  const sideBySideSx = forceSmall
    ? { display: 'none' }
    : { display: { xs: `none`, md: 'table-row' } };
  const stackedSx = forceSmall
    ? { display: 'table-row' }
    : { display: { xs: 'table-row', md: 'none' } };

  const qual: Match[] = [];
  const qf: Match[] = [];
  const sf: Match[] = [];
  const f: Match[] = [];

  const singleTeamSort: { [key: string]: Match[] } = {};
  let singleTeamEvent = false;

  if (matches.length > 0 && matches[0].participants.length !== 1) {
    // Multi-team match event
    matches.forEach(match => {
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
    // Single-team match event
  } else if (matches.length > 0 && matches[0].participants.length === 1) {
    singleTeamEvent = true;
    for (const match of matches) {
      if (match.participants.length === 1) {
        const team = match.participants[0].teamKey;
        if (!Array.isArray(singleTeamSort[team])) singleTeamSort[team] = [];
        singleTeamSort[team].push(match);
      }
    }
  }

  const renderTournamentLevel = (matches: Match[], translationKey: string) => {
    if (matches.length > 0 && !singleTeamEvent) {
      return (
        <>
          {/* SIDE-BY-SIDE MATCHES LEVEL HEADER */}
          <TableRow sx={sideBySideSx}>
            <TableCell colSpan={6}>
              <Typography variant="h6" align="center">
                {t(translationKey)}
              </Typography>
            </TableCell>
          </TableRow>

          {/* STACKED MATCHES LEVEL HEADER */}
          <TableRow sx={stackedSx}>
            <TableCell colSpan={4}>
              <Typography variant="h6" align="center">
                {t(translationKey)}
              </Typography>
            </TableCell>
          </TableRow>

          {/* Match Rows */}
          {matches.map((match: Match) => (
            <MatchTable key={match.matchKey} match={match} forceSmall={forceSmall} />
          ))}
        </>
      );
    }
    return null;
  };

  const pushToTeamsPage = (teamKey: string) => {
    if (props.event.seasonKey !== CURRENT_SEASON) {
      router.push({ pathname: `/teams/${teamKey}`, query: { season_key: props.event.seasonKey } });
    } else {
      router.push({ pathname: `/teams/${teamKey}` });
    }
  };

  const renderSingleTeams = () => {
    if (singleTeamEvent && Object.keys(singleTeamSort).length > 0) {
      return Object.keys(singleTeamSort).map((key, index) => {
        const matches = singleTeamSort[key];
        const bg = index % 2 === 0 ? 'red' : 'blue';
        const rank = props.event.rankings.find(r => r.teamKey === key);
        return (
          <>
            {!props.disableSingleTeamTeam && (
              <TableRow key={key}>
                <TableCell
                  className={'p-0 text-center'}
                  padding={'none'}
                  rowSpan={matches.length + 1}
                >
                  <Typography className={'fw-bold'} align="center">
                    Team #{key}
                  </Typography>
                  {rank && (
                    <>
                      <Typography align="center">{rank.team.teamNameShort}</Typography>
                      <Typography align="center">
                        from {rank.team.city}, {rank.team.stateProv}, {rank.team.country}
                      </Typography>
                      <Typography align="center">
                        Rank {rank.rank} of {props.event.rankings.length}
                      </Typography>
                    </>
                  )}
                  <Button variant={'contained'} onClick={() => pushToTeamsPage(key)}>
                    Go To Team
                    <ArrowForwardIos />
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {matches.map(m => (
              <TableRow key={m.matchKey}>
                <TableCell className={'p-0 text-center'} padding={'none'}>
                  {m.videoURL ? (
                    <a href={m.videoURL}>
                      <IconPlay />
                    </a>
                  ) : (
                    <IconPlay color={'disabled'} />
                  )}
                </TableCell>
                <TableCell className={`p-0 ${bg}-bg`} padding={'none'}>
                  <Typography
                    className={'match-table-text win'}
                    style={{ padding: '17px' }}
                    align="center"
                  >
                    {m.matchName}
                  </Typography>
                </TableCell>
                {m.redScore > -1 && (
                  <TableCell className={`p-0 ${bg}-bg`} padding={'none'}>
                    <Typography
                      className={'match-table-text win'}
                      style={{ padding: '17px' }}
                      align="center"
                    >
                      {m.redScore}
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </>
        );
      });
    }
    return null;
  };

  return (
    <Table className="event-match-table">
      <TableHead style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
        {!singleTeamEvent && (
          <>
            {/* SIDE-BY-SIDE MATCH TABLE HEADER */}
            <TableRow sx={sideBySideSx}>
              <TableCell>
                <Typography align="center">{t('match_table.match')}</Typography>
              </TableCell>
              <TableCell />
              <TableCell>
                <Typography align="center">{t('match_table.red_alliance')}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{t('match_table.blue_alliance')}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{t('match_table.red_score')}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{t('match_table.blue_score')}</Typography>
              </TableCell>
            </TableRow>

            {/* STACKED MATCH TABLE HEADER */}
            <TableRow sx={stackedSx}>
              <TableCell>
                <Typography align="center">{t('match_table.match')}</Typography>
              </TableCell>
              <TableCell />
              <TableCell>
                <Typography align="center">{t('match_table.red_alliance')}</Typography>
                <Typography align="center">{t('match_table.blue_alliance')}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{t('match_table.red_score')}</Typography>
                <Typography align="center">{t('match_table.blue_score')}</Typography>
              </TableCell>
            </TableRow>
          </>
        )}
        {singleTeamEvent && (
          <TableRow>
            {!props.disableSingleTeamTeam && (
              <TableCell>
                <Typography align="center">Team</Typography>
              </TableCell>
            )}
            <TableCell />
            <TableCell>
              <Typography align="center">{t('match_table.match')}</Typography>
            </TableCell>
            <TableCell>
              <Typography align="center">{t('match_table.scores')}</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableHead>

      <TableBody>
        {!singleTeamEvent && (
          <>
            {renderTournamentLevel(f, 'match_table.levels.finals')}
            {renderTournamentLevel(sf, 'match_table.levels.semifinals')}
            {renderTournamentLevel(qf, 'match_table.levels.quarterfinals')}
            {renderTournamentLevel(qual, 'match_table.levels.qualifications')}
          </>
        )}
        {singleTeamEvent && renderSingleTeams()}
      </TableBody>
    </Table>
  );
};

export default MatchesTab;
