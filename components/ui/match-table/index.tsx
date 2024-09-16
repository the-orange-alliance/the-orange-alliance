import React, { useMemo, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Match, Event, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '@/i18n/i18n';
import TOAProvider from '@/providers/toa-provider';
import TeamSelectionBar from './team-selection-bar';
import MatchTableRow from './row';
import MatchTableRemoteRow from './remote-row';
import MatchDetailsModal from './breakdown-modal';

interface MatchTableProps {
  event: Event;
  forceSmall?: boolean;
  allowSelection?: boolean;
  hideHeader?: boolean;
}

const MatchTable: React.FC<MatchTableProps> = ({
  event,
  forceSmall,
  allowSelection,
  hideHeader
}) => {
  const t = useTranslate();
  const theme = useTheme();
  const isStacked = useMediaQuery(theme.breakpoints.down('sm')) || forceSmall;
  const matches = event.matches;
  const [selectedTeam, setSelectedTeam] = useState<MatchParticipant | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    if (match.details.matchDetailKey === '') {
      TOAProvider.getAPI()
        .getMatchDetails(match.matchKey)
        .then(dtls => {
          const copy = new Match().fromJSON(match.toJSON());
          copy.details = dtls;
          // Cache these details, so the next time we don't have to fetch them
          match.details = dtls;
          setSelectedMatch(copy);
        })
        .catch(err => {
          setSelectedMatch(null);
        });
    }
  };

  return (
    <>
      <table className="event-match-table toa-match-table__root">
        {!hideHeader && (
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
                    color: '#fff',
                    backgroundColor: 'var(--toa-colors-red)',
                    // WebKit support
                    minWidth: 'calc((100% - 12.5em) / 2)',
                    maxWidth: 'calc((100% - 12.5em) / 2)'
                  }}
                >
                  {t('match_table.red_alliance')}
                </th>
                <th
                  style={{
                    color: '#fff',
                    backgroundColor: 'var(--toa-colors-blue)',
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
              <React.Fragment key={group.label}>
                <Box
                  component="tr"
                  bgcolor="background.default"
                  className="toa-match-table__group-header"
                >
                  <th>
                    <Typography
                      fontWeight={500}
                      align="center"
                      sx={{
                        display: 'inline-block',
                        bgcolor: 'background.paper',
                        padding: '0.125em 0.75em',
                        borderRadius: '10rem',
                        margin: '0.25em 0.5em',
                        ...theme.applyStyles('dark', {
                          bgcolor: 'grey.900'
                        })
                      }}
                      component="span"
                    >
                      {group.label}
                    </Typography>
                  </th>
                </Box>
                {group.matches.map((match: Match) =>
                  match.participants.length === 1 ? (
                    <MatchTableRemoteRow
                      key={match.matchKey}
                      match={match}
                      isStacked={isStacked}
                      onTeamClick={allowSelection ? handleTeamClick : undefined}
                      selectedTeam={allowSelection ? selectedTeam : null}
                      onMatchClick={handleMatchClick}
                    />
                  ) : (
                    <MatchTableRow
                      key={match.matchKey}
                      match={match}
                      isStacked={isStacked}
                      onTeamClick={allowSelection ? handleTeamClick : undefined}
                      selectedTeam={allowSelection ? selectedTeam : null}
                      onMatchClick={handleMatchClick}
                    />
                  )
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <TeamSelectionBar team={selectedTeam} rankings={event.rankings} />

      <MatchDetailsModal
        open={selectedMatch !== null}
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />

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
        .toa-match-table__root tr,
        .toa-match-table__root :global(.toa-match-table__group-header) {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
        .toa-match-table__thead th {
          font-weight: 500 !important;
          padding: 0.75em 0.25em;
        }
        .toa-match-table__root :global(.toa-match-table__row) {
          display: table;
          table-layout: fixed;
          width: 100%;
          max-width: 100%;
          min-width: 100%;
        }
        .toa-match-table__root :global(.toa-match-table__row):nth-of-type(odd) {
          background-color: ${theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(0, 0, 0, 0.04)'};
        }
        .toa-match-table__root :global(.toa-match-table__row td) {
          padding: 0;
          text-align: center;
        }
        @media (max-width: 600px) {
          .toa-match-table__root {
            font-size: 0.875em;
          }
        }
      `}</style>
    </>
  );
};

export default MatchTable;
