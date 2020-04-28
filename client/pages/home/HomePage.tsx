import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

// Component declarations
import StatisticCard from '../../components/StatisticCard';
import AnnouncementCard from "../../components/AnnouncementCard";

// module declarations
import LeaderboardsModule from "../../modules/LeaderboardsModule";


class HomePage extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Typography align={'center'} variant={'h3'}>The Orange Alliance</Typography>
        <Typography align={'center'} variant={'body1'}>The official data provider for <i>FIRST</i> Tech Challenge</Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <StatisticCard title={'6023'} subtitle={'Active Teams'} icon={<PeopleIcon/>}/>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <StatisticCard title={'6023'} subtitle={'Active Teams'} icon={<SportsEsportsIcon/>}/>
              </Grid>
              <Grid item xs={12}>
                <AnnouncementCard
                  content={
                    <Typography variant={'body1'}>
                      Due to the COVID-19 (Coronavirus) pandemic, <i>FIRST</i> has suspended all events for the duration of the season
                      including the <i>FIRST</i> Championships. Refer to <a href='https://www.firstinspires.org/covid-19'>firstinspires.org/covid-19</a> for more information.
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <LeaderboardsModule/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default HomePage;