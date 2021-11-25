import { ChangeEvent, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  Input,
  InputLabel,
  List,
  Pagination,
  Typography
} from '@mui/material';
import { useTranslate } from '../i18n/i18n';
import SimpleTeamPaper from '../components/SimpleTeamPaper';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getTeamsData, IRawTeamsProps, parseTeamsProps } from '../lib/PageHelpers/teamsHelper';

const TeamsPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslate();

  const { teams } = parseTeamsProps(props as IRawTeamsProps);

  const [shownTeamsLeft, setShownTeamsLeft] = useState<JSX.Element[]>([]);
  const [shownTeamsRight, setShownTeamsRight] = useState<JSX.Element[]>([]);
  const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);
  const [numPages, setNumPages] = useState<number>(teams.length);

  const doneTypingInt = 500;
  let typingTimer: NodeJS.Timeout;

  useEffect(() => {
    setPage(1, teams);
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
    setShownTeamsRight(
      right.map((team: Team) => <SimpleTeamPaper key={team.teamKey} team={team} />)
    );
  }

  function teamSearchOnChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      const query = event.target.value.toLowerCase();
      const newTeams = teams.filter(
        team =>
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
      <Typography variant="h4" gutterBottom>
        {t('pages.teams.title')}
      </Typography>
      <Card>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel htmlFor="teams-search">{t('pages.teams.filter')}</InputLabel>
            <Input id="teams-search" onChange={teamSearchOnChange} />
          </FormControl>
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
              <List>{shownTeamsLeft}</List>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <List>{shownTeamsRight}</List>
            </Grid>
          </Grid>
          <div className={'w-100 d-flex justify-content-center'}>
            <Pagination count={numPages} color="primary" onChange={onPageChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return { props: await getTeamsData() };
};

export default TeamsPage;
