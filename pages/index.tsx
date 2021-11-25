import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { Container, Grid, Typography } from '@mui/material';
import { People, SportsEsports } from '@mui/icons-material';
import { NextSeo } from 'next-seo';
import StatisticCard from '../components/StatisticCard';
import AnnouncementCard from '../components/AnnouncementCard';
import { useTranslate } from '../i18n/i18n';
import { getHomeData, IRawHomeProps, parseHomeProps } from '../lib/PageHelpers/homeHelper';
import LeaderboardsModule from '../components/LeaderboardsModule';

const Home: NextPage<IRawHomeProps> = props => {
  const t = useTranslate();

  const { matchSize, teamSize, elimsHighScore, qualsHighScore, overallHighScore } =
    parseHomeProps(props);

  return (
    <>
      <NextSeo title={`The Orange Alliance`} description={'we cool bois'} />
      <Container sx={{ bgcolor: '#f5f6f7' }}>
        <div>
          <Typography align={'center'} variant={'h3'} gutterBottom>
            The Orange Alliance
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                  <StatisticCard
                    title={`${matchSize}`}
                    subtitle={t('pages.home.matches_played')}
                    icon={<People />}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <StatisticCard
                    title={`${teamSize}`}
                    subtitle={t('pages.home.active_teams')}
                    icon={<SportsEsports />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AnnouncementCard
                    content={
                      <Typography variant={'body1'}>
                        Due to the COVID-19 (Coronavirus) pandemic, <i>FIRST</i> has suspended all
                        events for the duration of the season including the <i>FIRST</i>{' '}
                        Championships. Refer to{' '}
                        <a href="https://www.firstinspires.org/covid-19">
                          firstinspires.org/covid-19
                        </a>{' '}
                        for more information.
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
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
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: await getHomeData() };
};

export default Home;
