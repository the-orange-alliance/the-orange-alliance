import * as React from 'react';
import NextLink from 'next/link';
import SimpleMatchTable from '../components/SimpleMatchTable';
import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import { useTranslate } from '../i18n/i18n';
import { Card, CardContent, CardHeader, Divider, Link, Typography, useTheme } from '@mui/material';
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
  const header = ` 20${CURRENT_SEASON.substring(0, 2)}/${CURRENT_SEASON.substring(2, 4)} ${
    currentSeason?.description || ''
  }`;

  function renderMatch(title: string, subtitle: string, match: Match) {
    return (
      <div>
        <Typography variant={'h6'}>{title}</Typography>
        <Typography variant={'subtitle1'} gutterBottom>
          {subtitle}
        </Typography>
        <NextLink href={`/events/${match.event?.eventKey}/rankings`} passHref>
          <Link
            underline="none"
            fontSize="0.875rem"
            color={theme.palette.secondary.light}
            display="block"
          >
            {match.event?.eventName}
          </Link>
        </NextLink>
        <NextLink href={`/matches/${match.matchKey}`} passHref>
          <Link underline="none" fontWeight={500} display="block" mb={1}>
            {match.matchName}
          </Link>
        </NextLink>
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
