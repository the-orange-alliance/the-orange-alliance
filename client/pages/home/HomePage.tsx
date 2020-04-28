import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import StatisticCard from '../../components/StatisticCard';
import PeopleIcon from '@material-ui/icons/People';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';


class HomePage extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Typography align={'center'} variant={'h3'}>The Orange Alliance</Typography>
        <Typography align={'center'} variant={'body1'}>The official data provider for <i>FIRST</i> Tech Challenge</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={3}>
            <StatisticCard title={'6023'} subtitle={'Active Teams'} icon={<PeopleIcon/>}/>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <StatisticCard title={'6023'} subtitle={'Active Teams'} icon={<SportsEsportsIcon/>}/>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <div>Test!</div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default HomePage;