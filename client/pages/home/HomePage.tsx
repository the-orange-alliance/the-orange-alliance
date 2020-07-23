import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import TOAProvider from "../../providers/TOAProvider";
import {
  ApplicationActions,
  ISetTotalEventSize,
  ISetTotalTeamSize,
  setTotalEventSize,
  setTotalTeamSize
} from "../../stores/Actions";
import {IApplicationState} from "../../stores/Types";
import {Dispatch} from "redux";
import {connect} from "react-redux";

// Component declarations
import StatisticCard from '../../components/StatisticCard';
import AnnouncementCard from '../../components/AnnouncementCard';

// module declarations
import LeaderboardsModule from "../../modules/LeaderboardsModule";

interface IProps {
  eventSize: number;
  teamSize: number;
  setEventSize: (size: number) => ISetTotalEventSize;
  setTeamSize: (size: number) => ISetTotalTeamSize;
}

class HomePage extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public componentDidMount(): void {
    const {eventSize, teamSize, setEventSize, setTeamSize} = this.props;
    /* Make requests here ONLY if we know they haven't already been made */
    if (eventSize <= 0) {
      TOAProvider.getAPI().getEventCount().then((eventSize: number) => {setEventSize(eventSize)});
    }

    if (teamSize <= 0) {
      TOAProvider.getAPI().getTeamCount().then((teamSize: number) => {setTeamSize(teamSize)});
    }
  }

  public render() {
    const { eventSize, teamSize } = this.state;
    return (
      <div>
        <Typography align={'center'} variant={'h3'} gutterBottom>
          The Orange Alliance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <StatisticCard
                  title={`${eventSize}`}
                  subtitle={'Events'}
                  icon={<PeopleIcon />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <StatisticCard
                  title={`${teamSize}`}
                  subtitle={'Active Teams'}
                  icon={<SportsEsportsIcon />}
                />
              </Grid>
              <Grid item xs={12}>
                <AnnouncementCard
                  content={
                    <Typography variant={'body1'}>
                      Due to the COVID-19 (Coronavirus) pandemic, <i>FIRST</i>{' '}
                      has suspended all events for the duration of the season
                      including the <i>FIRST</i> Championships. Refer to{' '}
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
            <LeaderboardsModule />
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state: IApplicationState) {
  return {
    eventSize: state.eventsTotal,
    teamSize: state.teamsTotal
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEventSize: (size: number) => dispatch(setTotalEventSize(size)),
    setTeamSize: (size: number) => dispatch(setTotalTeamSize(size))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);