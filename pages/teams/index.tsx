import { ChangeEvent, useState, useCallback, useRef, useMemo } from 'react';
import { GetServerSideProps } from 'next';
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
import { fetchTeamsData, IRawTeamsProps, useTeamsData } from '../../lib/page-helpers/teams-helper';
import { Box } from '@mui/system';

const TEAMS_PER_PAGE = 20;

const TeamsPage: NextPage<IRawTeamsProps> = props => {
  const { teams } = useTeamsData(props);
  const t = useTranslate();
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
      <Typography sx={{ margin: 2 }} variant="h4">
        {t('pages.teams.title')}
      </Typography>
      <Card sx={{ margin: 2 }}>
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
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(filteredTeams.length / TEAMS_PER_PAGE)}
              color="primary"
              page={page}
              onChange={handlePageChange}
            />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: await fetchTeamsData() };
};

export default TeamsPage;
