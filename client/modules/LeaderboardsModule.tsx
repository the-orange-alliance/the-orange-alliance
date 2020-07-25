import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { IHighestScoringMatches } from '../stores/Types';

/* Components */
import SimpleMatchTable from '../components/SimpleMatchTable';
import Match from '@the-orange-alliance/api/lib/models/Match';

interface IProps {
  highScoreMatches: IHighestScoringMatches;
}

class LeaderboardsModule extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { highScoreMatches } = this.props;
    return (
      <Card>
        <CardHeader title={'Leaderboards'} subheader={'SKYSTONE 2019/20'} />
        <Divider />
        <CardContent>
          {this.renderMatch(
            'Highest Scoring Match',
            'With Penalties',
            highScoreMatches.overall
          )}
        </CardContent>
        <Divider />
        <CardContent>
          {this.renderMatch(
            'Highest Scoring Quals Match',
            'Without Penalties',
            highScoreMatches.quals
          )}
        </CardContent>
        <Divider />
        <CardContent>
          {this.renderMatch(
            'Highest Scoring Elims Match',
            'Without Penalties',
            highScoreMatches.elims
          )}
        </CardContent>
      </Card>
    );
  }

  private renderMatch(title: string, subtitle: string, match: Match) {
    return (
      <div>
        <Typography variant={'h6'}>{title}</Typography>
        <Typography variant={'subtitle1'} gutterBottom>
          {subtitle}
        </Typography>
        <Typography variant={'h6'}>{match.event?.eventName}</Typography>
        <Typography variant={'subtitle1'}>{match.matchName}</Typography>
        <SimpleMatchTable match={match} />
      </div>
    );
  }
}

export default LeaderboardsModule;
