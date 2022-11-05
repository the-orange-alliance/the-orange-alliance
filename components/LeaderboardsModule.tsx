import * as React from 'react';
import SimpleMatchTable from '../components/SimpleMatchTable';
import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import { useTranslate } from '../i18n/i18n';
import { Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { useAppContext } from '../pages/_app';
import { CURRENT_SEASON } from '../constants';

interface IProps {
  quals: Match;
  elims: Match;
  overall: Match;
}

const LeaderboardsModule = ({ quals, elims, overall }: IProps) => {
  const t = useTranslate();
  const theme = useTheme();
  const context = useAppContext();
  const currentSeason = context.seasons.find(s => s.seasonKey === CURRENT_SEASON);
  const header =
    (currentSeason ? `${currentSeason.description}` : '') +
    ` 20${CURRENT_SEASON.substr(0, 2)}/${CURRENT_SEASON.substr(2, 2)}`;

  function renderMatch(title: string, subtitle: string, match: Match) {
    return (
      <div>
        <Typography variant={'h6'}>{title}</Typography>
        <Typography variant={'subtitle1'} gutterBottom>
          {subtitle}
        </Typography>
        <Typography variant={'subtitle1'}>
          <a
            style={{ color: theme.palette.text.primary }}
            href={`/events/${match.event?.eventKey}/rankings`}
          >
            {match.event?.eventName}
          </a>
        </Typography>
        <Typography variant={'body2'}>
          <a style={{ color: theme.palette.text.primary }} href={`/matches/${match.matchKey}`}>
            {match.matchName}
          </a>
        </Typography>
        <SimpleMatchTable match={match} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader title={t('pages.home.leaderboards.title')} subheader={header} />
      <Divider />
      <CardContent>
        {renderMatch(
          t('pages.home.leaderboards.high_score_all'),
          `(${t('pages.home.leaderboards.with_penalties')})`,
          overall
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {renderMatch(
          t('pages.home.leaderboards.high_score_qual'),
          `(${t('pages.home.leaderboards.penalty_free')})`,
          quals
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {renderMatch(
          t('pages.home.leaderboards.high_score_elim'),
          `(${t('pages.home.leaderboards.penalty_free')})`,
          elims
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardsModule;
