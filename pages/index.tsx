import type { GetServerSideProps, NextPage } from 'next';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import MatchesIcon from '@mui/icons-material/SportsEsportsRounded';
import TeamsIcon from '@mui/icons-material/GroupsRounded';
import { NextSeo } from 'next-seo';
import StatisticCard from '../components/statistic-card';
import AnnouncementCard from '../components/AnnouncementCard';
import { useTranslate } from '../i18n/i18n';
import { fetchHomeData, IRawHomeProps, useHomeData } from '../lib/page-helpers/home-helper';
import LeaderboardsModule from '../components/LeaderboardsModule';
import Search from '../components/search';
import * as React from 'react';
import SimpleEventPaper from '../components/SimpleEventPaper';

const Home: NextPage<IRawHomeProps> = props => {
  const { matchSize, teamSize, elimsHighScore, qualsHighScore, overallHighScore, todaysEvents } =
    useHomeData(props);
  const t = useTranslate();

  return (
    <>
      <NextSeo title={`The Orange Alliance`} description={'we cool bois'} />
      <main>
        <Container>
          <Box sx={{ maxWidth: '36rem', mx: 'auto', py: 12, px: 2 }}>
            <Typography
              component="h1"
              align="center"
              sx={{
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem'
                },
                fontWeight: 700
              }}
            >
              The Orange Alliance
            </Typography>
            <Typography
              align="center"
              sx={{ fontSize: '1.125rem', fontWeight: 500, mb: 2.5, color: 'text.secondary' }}
            >
              The best way to scout, watch, and relive <em>FIRST</em> Tech Challenge
            </Typography>
            <Search showDescription maxResults={5} sx={{ maxWidth: '22rem', mx: 'auto' }} />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                  <StatisticCard
                    title={`${matchSize}`}
                    subtitle={t('pages.home.matches_played')}
                    icon={<MatchesIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <StatisticCard
                    title={`${teamSize}`}
                    subtitle={t('pages.home.active_teams')}
                    icon={<TeamsIcon />}
                  />
                </Grid>
              </Grid>

              <Card sx={{ mt: 2 }}>
                <CardHeader title={t('pages.home.todays_events')} />
                <Divider />
                <CardContent>
                  {todaysEvents.length === 0 && (
                    <Typography variant={'h6'} sx={{ marginTop: 1 }}>
                      {t('pages.home.no_events_today')}
                    </Typography>
                  )}
                  {todaysEvents.map(event => (
                    <SimpleEventPaper key={event.eventKey} event={event} />
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {/* This is temporary. ReactDOMServer does not support Suspense, yet. */}
              <LeaderboardsModule
                overall={overallHighScore}
                elims={elimsHighScore}
                quals={qualsHighScore}
              />
            </Grid>
          </Grid>
        </Container>
      </main>

      <style jsx>{`
        :global(main) {
          background: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, #f5f6f7 300px),
            fixed 0 0 /20px 20px radial-gradient(#d1d1d1 1px, transparent 0),
            fixed 10px 10px /20px 20px radial-gradient(#d1d1d1 1px, transparent 0), #fff;
        }
      `}</style>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', `public, s-maxage=60, stale-while-revalidate=${5 * 60}`);
  return { props: await fetchHomeData() };
};

export default Home;
