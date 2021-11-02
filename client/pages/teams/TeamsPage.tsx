import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";

import SimpleTeamPaper from "../../components/SimpleTeamPaper";
import Team from "@the-orange-alliance/api/lib/models/Team";
import { ApplicationActions, IApplicationState, ISetTeams, setTeams, getTeamsData, ITeamsProps } from "shared";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FormControl, Input, InputAdornment, InputLabel } from "@material-ui/core";

interface IProps {
  teams: Team[];
  setTeams: (teams: Team[]) => ISetTeams;
}

const TeamsPage = () => {
  const { t } = useTranslation();
  const teams = useSelector((state: IApplicationState) => state.teams);
  const dispatch = useDispatch();

  const [shownTeamsLeft, setShownTeamsLeft] = useState<JSX.Element[]>([]);
  const [shownTeamsRight, setShownTeamsRight] = useState<JSX.Element[]>([]);

  React.useEffect(() => {
    getTeamsData({ teams }).then((props: ITeamsProps) => {
      dispatch(setTeams(props.teams));
      setPage(1, props.teams);
    });
  }, []);

  function onPageChange(e: React.ChangeEvent<unknown>, page: number) {
    setPage(page);
  }

  function setPage(page: number, custTeams?: Team[]) {
    if (!custTeams) custTeams = teams;
    const startLocation = (page - 1) * 20;
    const left = custTeams.slice(startLocation, startLocation + 10);
    const right = custTeams.slice(startLocation + 10, startLocation + 20);
    setShownTeamsLeft(left.map((team: Team) => <SimpleTeamPaper key={team.teamKey} team={team} />));
    setShownTeamsRight(right.map((team: Team) => <SimpleTeamPaper key={team.teamKey} team={team} />));
  }

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        {t("pages.teams.title")}
      </Typography>
      <Card>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel htmlFor='teams-search'>Search Teams</InputLabel>
            <Input id='teams-search' />
          </FormControl>
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
              <List>{shownTeamsLeft}</List>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <List>{shownTeamsRight}</List>
            </Grid>
          </Grid>
          <Pagination count={Math.ceil(teams.length / 20)} color='primary' onChange={onPageChange} />
        </CardContent>
      </Card>
    </div>
  );
};

/* class TeamsPage extends React.Component<IProps> {
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
} */

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

// export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);
export default TeamsPage;
