import { ChangeEvent, useState, useCallback, useRef, useMemo } from 'react';
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
import { useTranslate } from '../../i18n/i18n';
import SimpleTeamPaper from '../../components/SimpleTeamPaper';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getTeamsData, IRawTeamsProps, parseTeamsProps } from '../../lib/PageHelpers/teamsHelper';

const TEAMS_PER_PAGE = 20;

const TeamsPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const t = useTranslate();
  const { teams } = parseTeamsProps(props as IRawTeamsProps);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>(teams);
  const [page, setPage] = useState<number>(1);
  const typingTimerRef = useRef<NodeJS.Timeout>();

  const handlePageChange = useCallback(
    (e: React.ChangeEvent<unknown>, page: number) => {
      setPage(page);
    },
    [setPage]
  );

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      typingTimerRef.current = setTimeout(() => {
        const query = event.target.value.toLowerCase();
        const newTeams = teams.filter(
          team =>
            String(team.teamNumber).includes(query) ||
            (team.teamNameShort && team.teamNameShort.toLowerCase().includes(query)) ||
            (team.city && team.city.toLowerCase().includes(query)) ||
            (team.country && team.country.toLowerCase().includes(query))
        );
        setFilteredTeams(newTeams);
        setPage(1);
      }, 500);
    },
    [teams]
  );

  const currentTeams = useMemo(() => {
    const startLocation = (page - 1) * TEAMS_PER_PAGE;
    return filteredTeams.slice(startLocation, startLocation + TEAMS_PER_PAGE);
  }, [filteredTeams, page]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t('pages.teams.title')}
      </Typography>
      <Card>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel htmlFor="teams-search">{t('pages.teams.filter')}</InputLabel>
            <Input id="teams-search" onChange={handleQueryChange} />
          </FormControl>
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
              <List>
                {[...currentTeams].splice(0, 10).map(team => (
                  <SimpleTeamPaper key={team.teamKey} team={team} />
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <List>
                {[...currentTeams].splice(10, 20).map(team => (
                  <SimpleTeamPaper key={team.teamKey} team={team} />
                ))}
              </List>
            </Grid>
          </Grid>
          <div className={'w-100 d-flex justify-content-center'}>
            <Pagination
              count={Math.ceil(filteredTeams.length / TEAMS_PER_PAGE)}
              color="primary"
              page={page}
              onChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: await getTeamsData() };
};

export default TeamsPage;
