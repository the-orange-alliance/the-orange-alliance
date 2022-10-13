import type { GetServerSideProps, NextPage } from 'next';
import { Container, Grid, Typography } from '@mui/material';
import MatchesIcon from '@mui/icons-material/SportsEsportsRounded';
import TeamsIcon from '@mui/icons-material/GroupsRounded';
import { NextSeo } from 'next-seo';
import StatisticCard from '../components/statistic-card';
import AnnouncementCard from '../components/AnnouncementCard';
import { useTranslate } from '../i18n/i18n';
import { fetchHomeData, IRawHomeProps, useHomeData } from '../lib/page-helpers/home-helper';
import LeaderboardsModule from '../components/LeaderboardsModule';

const Home: NextPage<IRawHomeProps> = props => {
  const { matchSize, teamSize, elimsHighScore, qualsHighScore, overallHighScore } =
    useHomeData(props);
  const t = useTranslate();

  return (
    <>
      <NextSeo title={`The Orange Alliance`} description={'we cool bois'} />
      <Container>
        <Typography component="h1" align="center" sx={{ fontSize: '2rem', fontWeight: 500, my: 6 }}>
          The Orange Alliance
        </Typography>
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
              {/*<Grid item xs={12}>*/}
              {/*  <AnnouncementCard*/}
              {/*    content={*/}
              {/*      <Typography variant={'body1'}>*/}
              {/*        Due to the COVID-19 (Coronavirus) pandemic, <em>FIRST</em> has suspended all*/}
              {/*        events for the duration of the season including the <em>FIRST</em>{' '}*/}
              {/*        Championships. Refer to{' '}*/}
              {/*        <a href="https://www.firstinspires.org/covid-19">*/}
              {/*          firstinspires.org/covid-19*/}
              {/*        </a>{' '}*/}
              {/*        for more information.*/}
              {/*      </Typography>*/}
              {/*    }*/}
              {/*  />*/}
              {/*</Grid>*/}
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
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', `public, s-maxage=60, stale-while-revalidate=${5 * 60}`);
  return { props: await fetchHomeData() };
};

export default Home;
