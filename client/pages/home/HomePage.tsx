import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import TOAProvider from "../../providers/TOAProvider";

// Component declarations
import StatisticCard from '../../components/StatisticCard';
import AnnouncementCard from "../../components/AnnouncementCard";

// module declarations
import LeaderboardsModule from "../../modules/LeaderboardsModule";

interface IState {
  eventSize: number;
  teamSize: number;
}

class HomePage extends React.Component<{}, IState> {
  public constructor(props: any) {
    super(props);

    this.state = {
      eventSize: 0,
      teamSize: 0
    };
  }

  public componentDidMount(): void {
    // Make requests here Kappa
    TOAProvider.getAPI().getEventCount().then((eventSize: number) => {this.setState({eventSize})});
    TOAProvider.getAPI().getTeamCount().then((teamSize: number) => {this.setState({teamSize})});
  }

  public render() {
    const {eventSize, teamSize} = this.state;
    return (
      <div>
        <Typography align={'center'} variant={'h3'} gutterBottom>The Orange Alliance</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <StatisticCard title={`${eventSize}`} subtitle={'Events'} icon={<PeopleIcon/>}/>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <StatisticCard title={`${teamSize}`} subtitle={'Active Teams'} icon={<SportsEsportsIcon/>}/>
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