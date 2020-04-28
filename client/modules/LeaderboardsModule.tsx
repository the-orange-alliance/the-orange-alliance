import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

/* Components */
import SimpleMatchTable from "../components/SimpleMatchTable";

class LeaderboardsModule extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Card>
        <CardHeader
          title={'Leaderboards'}
          subheader={'SKYSTONE 2019/20'}
        />
        <Divider/>
        <CardContent>
          <Typography variant={'h6'}>Highest Scoring Match</Typography>
          <Typography variant={'subtitle1'} gutterBottom>(With Penalties)</Typography>

          <Typography variant={'h6'}>Idaho Championship</Typography>
          <Typography variant={'subtitle1'}>Quals 24</Typography>
          <SimpleMatchTable/>
        </CardContent>
      </Card>
    );
  }
}

export default LeaderboardsModule;