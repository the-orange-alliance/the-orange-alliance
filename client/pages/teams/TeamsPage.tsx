import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

import SimpleTeamPaper from "../../components/SimpleTeamPaper";
import Team from "@the-orange-alliance/api/lib/esm/models/Team";
import { ApplicationActions, IApplicationState, ISetTeams, setTeams, getTeamsData, ITeamsProps } from "shared";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";
import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";

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
  const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);
  const [numPages, setNumPages] = useState<number>(teams.length);

  const doneTypingInt = 500;
  let typingTimer: NodeJS.Timeout;

  React.useEffect(() => {
    getTeamsData({ teams }).then((props: ITeamsProps) => {
      dispatch(setTeams(props.teams));
      setPage(1, props.teams);
    });
  }, []);

  function onPageChange(e: React.ChangeEvent<unknown>, page: number) {
    setPage(page);
  }

  // Pages ALWAYS START AT 1
  function setPage(page: number, custTeams?: Team[]) {
    if (!custTeams) custTeams = currentTeams;
    setNumPages(Math.ceil(custTeams.length / 20));
    const startLocation = (page - 1) * 20;
    const left = custTeams.slice(startLocation, startLocation + 10);
    const right = custTeams.slice(startLocation + 10, startLocation + 20);
    setShownTeamsLeft(left.map((team: Team) => <SimpleTeamPaper key={team.teamKey} team={team} />));
    setShownTeamsRight(right.map((team: Team) => <SimpleTeamPaper key={team.teamKey} team={team} />));
  }

  function teamSearchOnChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      const query = event.target.value.toLowerCase();
      const newTeams = teams.filter(
        (team) =>
          String(team.teamNumber).includes(query) ||
          (team.teamNameShort && team.teamNameShort.toLowerCase().includes(query)) ||
          (team.city && team.city.toLowerCase().includes(query)) ||
          (team.country && team.country.toLowerCase().includes(query))
      );
      setCurrentTeams(newTeams);
      setPage(1, newTeams);
    }, doneTypingInt);
  }

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        {t("pages.teams.title")}
      </Typography>
      <Card>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel htmlFor='teams-search'>{t("pages.teams.filter")}</InputLabel>
            <Input id='teams-search' onChange={teamSearchOnChange} />
          </FormControl>
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
              <List>{shownTeamsLeft}</List>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <List>{shownTeamsRight}</List>
            </Grid>
          </Grid>
          <div className={"w-100 d-flex justify-content-center"}>
            <Pagination count={numPages} color='primary' onChange={onPageChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
