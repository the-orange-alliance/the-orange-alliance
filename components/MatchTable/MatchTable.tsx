import * as React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Snackbar,
  Grid,
  Drawer,
  Box,
  CircularProgress
} from '@mui/material';
import { Match, Event, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import MatchTableRow from './MatchTableRow';
import { ArrowForwardIos, PlayCircleOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { CURRENT_SEASON } from '../../constants';
import { useEffect, useState } from 'react';
import MatchDetailsCard from '../MatchDetails/MatchDetailsCard';
import TOAProvider from '../../providers/TOAProvider';

interface IProps {
  event: Event;
  forceSmall?: boolean;
  disableSingleTeamTeam?: boolean;
  disableSelection?: boolean;
}

const MatchesTable = (props: IProps) => {
  const router = useRouter();
  const { forceSmall, disableSelection, disableSingleTeamTeam } = props;
  const { matches } = props.event;
  const t = useTranslate();
  const [selectedTeam, setSelectedTeam] = useState<MatchParticipant | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!drawerOpen && selectedMatch) {
      setTimeout(() => setSelectedMatch(null), 200);
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (selectedMatch) setDrawerOpen(true);
    if (selectedMatch && selectedMatch.details.matchKey === '') {
      TOAProvider.getAPI()
        .getMatchDetails(selectedMatch.matchKey)
        .then(dtls => {
          const copy = new Match().fromJSON(selectedMatch.toJSON());
          copy.details = dtls;
          // Set these details because this technically should reference to the original data we got from the server
          // This way, the next time the user loads these details they exist
          selectedMatch.details = dtls;
          setSelectedMatch(copy);
        })
        .catch(() => {
          setDrawerOpen(false);
        });
    }
  }, [selectedMatch]);

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
            <MatchTableRow
              key={match.matchKey}
              match={match}
              forceSmall={forceSmall}
              setSelectedTeam={disableSelection ? () => {} : setSelectedTeam}
              selectedTeam={disableSelection ? null : selectedTeam}
              setSelectedMatch={setSelectedMatch}
            />
          ))}
        </>
      );
    }
    return null;
  };

  const pushToTeamsPage = (teamKey: string) => {
    if (teamKey === '') return;
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
            {!disableSingleTeamTeam && (
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
                      <PlayCircleOutline />
                    </a>
                  ) : (
                    <PlayCircleOutline color={'disabled'} />
                  )}
                </TableCell>
                <TableCell className={`p-0 ${bg}-bg`} padding={'none'}>
                  <Typography
                    className={'match-table-text win'}
                    style={{ padding: '17px' }}
                    align="center"
                    onClick={() => setSelectedMatch(m)}
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

  const snackbarMessage = (): JSX.Element | null => {
    if (!selectedTeam) return null;
    const rank = props.event.rankings.find(t => t.teamKey === selectedTeam.teamKey);
    if (!rank) return null;
    return (
      <>
        <Typography>
          <b>#{rank.teamKey}</b> {rank.team.teamNameShort}
        </Typography>
        <Grid container direction={'row'}>
          <Grid item>
            <span className={'badge badge-success mt-1 me-1 p-2'}>
              <b>
                {rank.wins}-{rank.losses}-{rank.ties}
              </b>{' '}
              {t('match_table.wlt')}
            </span>
          </Grid>
          <Grid item>
            <span className={'badge badge-info mt-1 ms-1 me-1 p-2'}>
              <b>{rank.rank}</b> {t('match_table.rank')}
            </span>
          </Grid>
          <Grid item>
            <span className={'badge badge-warning mt-1 ms-1 me-1 p-2'}>
              <b>{rank.played}</b> {t('match_table.played')}
            </span>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      {/* MATCH TABLE */}
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
              {!disableSingleTeamTeam && (
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

      {/* SELECTED TEAM SNACKBAR */}
      <Snackbar
        open={selectedTeam !== null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        message={snackbarMessage()}
        action={
          <Button size="small" onClick={() => pushToTeamsPage(selectedTeam?.teamKey ?? '')}>
            {t('match_table.view_team')} <ArrowForwardIos />
          </Button>
        }
      />

      {/* SELECTED MATCH TRAY */}
      <Drawer
        anchor={'right'}
        open={drawerOpen}
        transitionDuration={200}
        PaperProps={{ style: { maxWidth: '90%' } }}
        onClose={() => setDrawerOpen(false)}
        sx={theme => {
          return { zIndex: theme.zIndex.drawer + 2 };
        }}
      >
        <Box>
          {selectedMatch && selectedMatch.details.matchKey === '' && (
            <Box className={'text-center mt-5'} sx={{ minWidth: 300 }}>
              <CircularProgress />
            </Box>
          )}
          {selectedMatch && selectedMatch.details.matchKey !== '' && (
            <MatchDetailsCard match={selectedMatch} />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default MatchesTable;
