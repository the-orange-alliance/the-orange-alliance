import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import {
  ApplicationActions,
  ISetHighScoreElims,
  ISetHighScoreOverall,
  ISetHighScoreQuals,
  ISetTotalEventSize,
  ISetTotalTeamSize,
  setHighScoreElims,
  setHighScoreOverall,
  setHighScoreQuals,
  setTotalEventSize,
  setTotalTeamSize,
  IApplicationState,
  IHighestScoringMatches,
  TOAProvider,
  getHomeData,
  IHomeProps
} from 'shared';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Match from '@the-orange-alliance/api/lib/models/Match';

// Component declarations
import StatisticCard from '../../components/StatisticCard';
import AnnouncementCard from '../../components/AnnouncementCard';

// module declarations
import LeaderboardsModule from '../../modules/LeaderboardsModule';

interface IProps {
  eventSize: number;
  teamSize: number;
  highScoreMatches: IHighestScoringMatches;
  setEventSize: (size: number) => ISetTotalEventSize;
  setTeamSize: (size: number) => ISetTotalTeamSize;
  setHighScoreOverall: (match: Match) => ISetHighScoreOverall;
  setHighScoreQuals: (match: Match) => ISetHighScoreQuals;
  setHighScoreElims: (match: Match) => ISetHighScoreElims;
}

class HomePage extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public componentDidMount(): void {
    const {
      eventSize,
      teamSize,
      highScoreMatches,
      setEventSize,
      setTeamSize,
      setHighScoreOverall,
      setHighScoreQuals,
      setHighScoreElims
    } = this.props;

    getHomeData({ eventSize, teamSize, highScoreMatches }).then(
      (data: IHomeProps) => {
        setEventSize(data.eventSize);
        setTeamSize(data.teamSize);
        setHighScoreOverall(data.highScoreMatches.overall);
        setHighScoreQuals(data.highScoreMatches.quals);
        setHighScoreElims(data.highScoreMatches.elims);
      }
    );
  }

  public render() {
    const { eventSize, teamSize, highScoreMatches } = this.props;
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
            <LeaderboardsModule highScoreMatches={highScoreMatches} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state: IApplicationState) {
  return {
    eventSize: state.eventsTotal,
    teamSize: state.teamsTotal,
    highScoreMatches: state.highScoreMatches
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEventSize: (size: number) => dispatch(setTotalEventSize(size)),
    setTeamSize: (size: number) => dispatch(setTotalTeamSize(size)),
    setHighScoreOverall: (match: Match) => dispatch(setHighScoreOverall(match)),
    setHighScoreQuals: (match: Match) => dispatch(setHighScoreQuals(match)),
    setHighScoreElims: (match: Match) => dispatch(setHighScoreElims(match))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
