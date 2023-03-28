import { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Snackbar,
  Grid,
  Drawer,
  Box,
  CircularProgress,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Match, Event, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import MatchDetailsCard from '../MatchDetails/MatchDetailsCard';
import TOAProvider from '../../providers/TOAProvider';
import TeamSelectionBar from './team-selection-bar';
import MatchTableRow from './row';
import MatchTableRemoteRow from './remote-row';

interface IProps {
  event: Event;
  forceSmall?: boolean;
  disableSingleTeamTeam?: boolean;
  allowSelection?: boolean;
  hideHeader?: boolean;
}

const MatchTable = (props: IProps) => {
  const { forceSmall, allowSelection, disableSingleTeamTeam } = props;
  const { matches } = props.event;
  const t = useTranslate();
  const theme = useTheme();
  const isStacked = useMediaQuery(theme.breakpoints.down('sm')) || forceSmall;

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
    if (selectedMatch && selectedMatch.details.matchDetailKey === '') {
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
        .catch(err => {
          setDrawerOpen(false);
        });
    }
  }, [selectedMatch]);

  const groupedMatches = useMemo(() => {
    const grouped: { [key: string]: Match[] } = {};
    for (const match of matches) {
      let group = 'Unknown Matchs';
      if (match.participants.length === 1) {
        group = `Team ${match.participants[0].teamKey}`;
      } else if (match.tournamentLevel === 1) {
        group = 'Qualifications';
      } else if (match.tournamentLevel > 20 && match.tournamentLevel < 30) {
        group = 'Quarterfinals';
      } else if (match.tournamentLevel > 30 && match.tournamentLevel < 40) {
        group = 'Semifinals';
      } else if (match.tournamentLevel === 4) {
        group = 'Finals';
      }

      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(match);
    }
    for (const group in grouped) {
      grouped[group].sort((a: Match, b: Match) => {
        const matchNumber1 = parseInt(a.matchKey.split('-')[3].substring(1));
        const matchNumber2 = parseInt(b.matchKey.split('-')[3].substring(1));
        return matchNumber1 - matchNumber2;
      });
    }
    const groups = Object.entries(grouped).map(([label, matches]) => ({ label, matches }));
    groups.sort((a, b) => {
      let order1 = a.matches[0].tournamentLevel;
      let order2 = b.matches[0].tournamentLevel;
      if (order1 > 10) order1 /= 10;
      if (order2 > 10) order2 /= 10;
      return order2 - order1;
    });
    return groups;
  }, [matches]);

  const handleTeamClick = (team: MatchParticipant) => {
    setSelectedTeam(current => (current && current.teamKey === team.teamKey ? null : team));
  };

  return (
    <>
      <table className="event-match-table toa-match-table__root">
        {!props.hideHeader && (
          <thead className="toa-match-table__thead">
            {isStacked ? (
              <tr>
                <th style={{ width: '2em' }} />
                <th style={{ width: '4em' }}>{t('match_table.match')}</th>
                <th style={{ width: '4em' }}>{t('match_table.scores')}</th>
                <th>
                  {t('match_table.red_alliance')}
                  <br />
                  {t('match_table.blue_alliance')}
                </th>
              </tr>
            ) : (
              <tr>
                <th style={{ width: '2.5em' }} />
                <th style={{ width: '6em' }}>{t('match_table.match')}</th>
                <th style={{ width: '6em' }}>{t('match_table.scores')}</th>
                <th
                  style={{
                    // WebKit support
                    minWidth: 'calc((100% - 12.5em) / 2)',
                    maxWidth: 'calc((100% - 12.5em) / 2)'
                  }}
                >
                  {t('match_table.red_alliance')}
                </th>
                <th
                  style={{
                    // WebKit support
                    minWidth: 'calc((100% - 12.5em) / 2)',
                    maxWidth: 'calc((100% - 12.5em) / 2)'
                  }}
                >
                  {t('match_table.blue_alliance')}
                </th>
              </tr>
            )}
          </thead>
        )}

        <tbody>
          {groupedMatches.map((group, i) => {
            return (
              <>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th>
                    <Typography
                      fontWeight={500}
                      align="center"
                      sx={{
                        display: 'inline-block',
                        backgroundColor: '#fff',
                        padding: '0.125em 0.75em',
                        borderRadius: '10rem',
                        margin: '0.25em 0.5em'
                      }}
                    >
                      {group.label}
                    </Typography>
                  </th>
                </tr>
                {group.matches.map((match: Match) =>
                  match.participants.length === 1 ? (
                    <MatchTableRemoteRow
                      key={match.matchKey}
                      match={match}
                      isStacked={isStacked}
                      onTeamClick={allowSelection ? handleTeamClick : undefined}
                      selectedTeam={allowSelection ? selectedTeam : null}
                      onMatchClick={setSelectedMatch}
                    />
                  ) : (
                    <MatchTableRow
                      key={match.matchKey}
                      match={match}
                      isStacked={isStacked}
                      onTeamClick={allowSelection ? handleTeamClick : undefined}
                      selectedTeam={allowSelection ? selectedTeam : null}
                      onMatchClick={setSelectedMatch}
                    />
                  )
                )}
              </>
            );
          })}
        </tbody>
      </table>

      <style jsx>{`
        .toa-match-table__root {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          border: none;
        }
        .toa-match-table__root tbody {
          display: block;
        }
        .toa-match-table__root tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
        .toa-match-table__thead th {
          font-weight: 500 !important;
          padding: 0.5em 0.25em;
        }
        .toa-match-table__root :global(.toa-match-table__row) {
          display: table;
          table-layout: fixed;
          width: 100%;
          max-width: 100%;
          min-width: 100%;
        }
        .toa-match-table__root :global(.toa-match-table__row):nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.04);
        }
        .toa-match-table__root :global(.toa-match-table__row td) {
          padding: 0;
          text-align: center;
        }
        .toa-match-table__root :global(.toa-match-table__video) {
          text-align: left !important;
          padding-left: 0.25em !important;
        }
        @media (max-width: 600px) {
          .toa-match-table__root {
            font-size: 0.875em;
          }
        }
      `}</style>

      {/* SELECTED TEAM SNACKBAR */}
      <Snackbar
        open={selectedTeam !== null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        message={<TeamSelectionBar team={selectedTeam} rankings={props.event.rankings} />}
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
          {selectedMatch && [
            <Grid
              key={'header'}
              container
              direction={'row'}
              sx={{ textAlign: 'center', backgroundColor: 'rgba(224, 224, 224, 1)' }}
            >
              <Grid item xs={11} sx={{ marginTop: 0.5 }}>
                <Typography variant={'h6'}>{selectedMatch.matchName}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <Close />
                </IconButton>
              </Grid>
            </Grid>,
            <Divider key={'divider'} />
          ]}
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

export default MatchTable;
