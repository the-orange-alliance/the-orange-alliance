import { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import MatchBreakdown1617 from './match-breakdowns/MatchBreakdown1617';
import MatchBreakdown1718 from './match-breakdowns/MatchBreakdown1718';
import MatchBreakdown1819 from './match-breakdowns/MatchBreakdown1819';
import MatchBreakdown1920 from './match-breakdowns/MatchBreakdown1920';
import MatchBreakdown2021 from './match-breakdowns/MatchBreakdown2021';
import MatchBreakdown2122 from './match-breakdowns/MatchBreakdown2122';
import MatchBreakdown2223 from './match-breakdowns/MatchBreakdown2223';
import { MatchBreakdownRow, MatchBreakdownTitle } from './match-breakdown-row';
import MatchBreakdown2324 from './match-breakdowns/MatchBreakdown2324';
import MatchBreakdown2425 from './match-breakdowns/MatchBreakdown2425';
import MatchBreakdown2526 from './match-breakdowns/MatchBreakdown2526';

interface MatchDetailsCardProps {
  match: Match;
}

const MatchDetailsCard: React.FC<MatchDetailsCardProps> = ({ match }) => {
  console.log(match);
  const isRemote = match.redScore > -1 && match.blueScore === -1;

  let rows: MatchBreakdownRow[] = useMemo(() => {
    if (match.details) {
      switch (parseInt(match.matchKey.split('-')[0], 10)) {
        case 1617:
          return new MatchBreakdown1617().getRows(match);
        case 1718:
          return new MatchBreakdown1718().getRows(match);
        case 1819:
          return new MatchBreakdown1819().getRows(match);
        case 1920:
          return new MatchBreakdown1920().getRows(match);
        case 2021:
          return new MatchBreakdown2021().getRows(match);
        case 2122:
          return new MatchBreakdown2122().getRows(match);
        case 2223:
          return new MatchBreakdown2223().getRows(match);
        case 2324:
          return new MatchBreakdown2324().getRows(match);
        case 2425:
          return new MatchBreakdown2425().getRows(match);
        case 2526:
          return new MatchBreakdown2526().getRows(match);
      }
    }

    if (match.redAutoScore > -1) {
      return [
        MatchBreakdownTitle('Autonomous', match.redAutoScore, match.blueAutoScore),
        MatchBreakdownTitle('Teleop', match.redTeleScore, match.blueTeleScore),
        MatchBreakdownTitle('End Game', match.redEndScore, match.blueEndScore),
        MatchBreakdownTitle('Penalty', match.bluePenalty, match.redPenalty)
      ];
    } else {
      return [];
    }
  }, [match]);

  return rows.length > 0 ? (
    <Box>
      <Grid container>
        <Grid xs={6} item />
        <Grid
          xs={isRemote ? 6 : 3}
          sx={{
            p: 1,
            color: '#fff',
            bgcolor: isRemote ? 'var(--toa-colors-tie)' : 'var(--toa-colors-red)',
            fontSize: '1.125rem',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.25
          }}
          item
        >
          {!isRemote && (
            <span style={{ display: 'block', fontSize: '0.75em', fontWeight: 500 }}>Red</span>
          )}{' '}
          {match.redScore}
        </Grid>
        {!isRemote && (
          <Grid
            xs={3}
            sx={{
              p: 1,
              color: '#fff',
              bgcolor: 'var(--toa-colors-blue)',
              fontSize: '1.125rem',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.25
            }}
            item
          >
            <span style={{ display: 'block', fontSize: '0.75em', fontWeight: 500 }}>Blue</span>
            {match.blueScore}
          </Grid>
        )}
      </Grid>
      {rows.map((r, index) => (
        <Grid
          key={index}
          container
          sx={theme => ({
            backgroundColor: r.isTitle ? 'rgba(0, 0, 0, 0.04)' : '',
            ...theme.applyStyles('dark', {
              backgroundColor: r.isTitle ? 'rgba(0, 0, 0, 0.12)' : ''
            })
          })}
        >
          <Grid xs={6} sx={{ px: 2, py: 1 }} item>
            <Typography style={{ fontWeight: r.isTitle ? 'bold' : 'normal' }}>{r.name}</Typography>
          </Grid>

          {/* Red Details */}
          <Grid
            xs={isRemote ? 6 : 3}
            sx={{
              padding: 1,
              backgroundColor: isRemote
                ? 'var(--toa-colors-tie-transparent)'
                : 'var(--toa-colors-red-transparent)',
              textAlign: 'center'
            }}
            item
          >
            <Typography
              display="inline-flex"
              sx={{
                verticalAlign: 'bottom',
                color:
                  r.red !== 0
                    ? isRemote
                      ? 'var(--toa-colors-tie)'
                      : 'var(--toa-colors-red)'
                    : 'text.secondary',
                fontWeight: r.isTitle ? 700 : r.red !== 0 ? 500 : 400
              }}
            >
              {r.redIcon}
              {r.getRedPoints()}
            </Typography>
          </Grid>

          {/* Blue Details if we have a blue score (not a single-team match) */}
          {!isRemote && (
            <Grid
              xs={3}
              sx={{
                padding: 1,
                backgroundColor: 'var(--toa-colors-blue-transparent)',
                textAlign: 'center'
              }}
              item
            >
              <Typography
                display="inline-flex"
                sx={{
                  verticalAlign: 'bottom',
                  color: r.blue !== 0 ? 'var(--toa-colors-blue)' : 'text.secondary',
                  fontWeight: r.isTitle ? 700 : r.blue !== 0 ? 500 : 400
                }}
              >
                {r.blueIcon}
                {r.getBluePoints()}
              </Typography>
            </Grid>
          )}
        </Grid>
      ))}
    </Box>
  ) : null;
};

export default MatchDetailsCard;
