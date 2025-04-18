import type { GetServerSideProps, NextPage } from 'next';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Typography,
  alpha
} from '@mui/material';
import MatchesIcon from '@mui/icons-material/SportsEsportsRounded';
import TeamsIcon from '@mui/icons-material/GroupsRounded';
import StatisticCard from '@/components/pages/home/statistic-card';
import { useTranslate } from '@/i18n/i18n';
import { fetchHomeData, IRawHomeProps, useHomeData } from '@/lib/page-helpers/home-helper';
import LeaderboardCard from '@/components/pages/home/leaderboard-card';
import EventItem from '@/components/ui/event-item';
import Search from '@/components/navigation/search';
import SEO from '@/components/seo';
import EventType from '@the-orange-alliance/api/lib/cjs/models/types/EventType';
import ChampionshipCoverage from '@/components/pages/home/championship';

const Home: NextPage<IRawHomeProps> = props => {
  const { matchSize, teamSize, elimsHighScore, qualsHighScore, overallHighScore, todaysEvents } =
    useHomeData(props);
  const t = useTranslate();
  const isChampionship = todaysEvents.some(event => event.eventTypeKey === EventType.WorldChamp);

  return (
    <>
      <SEO url="" />
      <Box
        component="main"
        sx={theme => {
          const forgroundColor =
            theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black;
          const backgroundColor =
            theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white;

          return {
            background: [
              `linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, ${theme.palette.background.default} 300px)`,
              `fixed 0 0 /20px 20px radial-gradient(${alpha(
                forgroundColor,
                0.2
              )} 1px, transparent 0)`,
              `fixed 10px 10px /20px 20px radial-gradient(${alpha(
                forgroundColor,
                0.2
              )} 1px, transparent 0), ${backgroundColor}`
            ].join(', ')
          };
        }}
      >
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
              {isChampionship && <ChampionshipCoverage events={todaysEvents} />}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                  <StatisticCard
                    title={`${matchSize.toLocaleString('en-US')}`}
                    subtitle={t('pages.home.matches_played')}
                    icon={<MatchesIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <StatisticCard
                    title={`${teamSize.toLocaleString('en-US')}`}
                    subtitle={t('pages.home.active_teams')}
                    icon={<TeamsIcon />}
                  />
                </Grid>
              </Grid>

              {!isChampionship && (
                <Card sx={{ mt: 2 }}>
                  <CardHeader title={t('pages.home.todays_events')} />
                  <Divider />
                  <CardContent>
                    {todaysEvents.length === 0 && (
                      <Typography variant="subtitle1" color="text.secondary" mt={1}>
                        {t('pages.home.no_events_today')}
                      </Typography>
                    )}
                    {todaysEvents.map(event => (
                      <EventItem key={event.eventKey} event={event} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {/* This is temporary. ReactDOMServer does not support Suspense, yet. */}
              <LeaderboardCard
                overall={overallHighScore}
                elims={elimsHighScore}
                quals={qualsHighScore}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', `public, s-maxage=60, stale-while-revalidate=${5 * 60}`);
  return { props: await fetchHomeData() };
};

export default Home;
