import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';

import SimpleTeamPaper from '../../components/SimpleTeamPaper';
import Team from '@the-orange-alliance/api/lib/models/Team';
import {
  ApplicationActions,
  IApplicationState,
  ISetTeams,
  setTeams,
  getTeamsData,
  ITeamsProps
} from 'shared';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface IProps {
  teams: Team[];
  setTeams: (teams: Team[]) => ISetTeams;
}

class TeamsPage extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount(): void {
    const { teams, setTeams } = this.props;

    getTeamsData({ teams }).then((props: ITeamsProps) => {
      setTeams(props.teams);
    });
  }

  public render() {
    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Teams
        </Typography>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={12} md={6}>
                <List>{this.renderList(10)}</List>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <List>{this.renderList(10)}</List>
              </Grid>
            </Grid>
            <Pagination count={10} color="primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  private renderList(count: number) {
    const items: any[] = [];
    for (let i = 0; i < count; i++) {
      items.push(<SimpleTeamPaper key={count} />);
    }
    return items;
  }
}

function mapStateToProps(state: IApplicationState) {
  return {
    teams: state.teams
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setTeams: (teams: Team[]) => dispatch(setTeams(teams))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);
