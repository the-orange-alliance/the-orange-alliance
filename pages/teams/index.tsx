import { ChangeEvent, useState, useCallback, useRef, useMemo } from 'react';
import type { NextPage } from 'next';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';
import {
  Card,
  CardContent,
  Container,
  InputAdornment,
  List,
  Pagination,
  TextField,
  Typography
} from '@mui/material';
import { useTranslate } from '@/i18n/i18n';
import TeamItem from '@/components/ui/team-item';
import { Box } from '@mui/material';
import { fetchTeamsData, IRawTeamsProps, parseTeamsProps } from '@/lib/page-helpers/teams-helper';
import SEO from '@/components/seo';
import { Search as SearchIcon } from '@mui/icons-material';

const TEAMS_PER_PAGE = 20;

const TeamsPage: NextPage<IRawTeamsProps> = props => {
  const { teams } = parseTeamsProps(props);
  const t = useTranslate();
  const [filteredTeams, setFilteredTeams] = useState<Team[]>(teams);
  const [page, setPage] = useState<number>(1);
  const typingTimerRef = useRef<NodeJS.Timeout>(undefined);

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
    <>
      <SEO title="Teams" description="List of FIRST Tech Challenge teams." url="/teams" />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h1">
          <em>FIRST</em> Tech Challenge Teams
        </Typography>
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder={t('pages.teams.filter')}
              variant="outlined"
              onChange={handleQueryChange}
              sx={{ mb: 4 }}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }}
            />

            <List
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }
              }}
            >
              {currentTeams.map(team => (
                <TeamItem key={team.teamKey} team={team} />
              ))}
            </List>

            <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(filteredTeams.length / TEAMS_PER_PAGE)}
                color="primary"
                page={page}
                onChange={handlePageChange}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default TeamsPage;

export async function getStaticProps() {
  return {
    props: await fetchTeamsData(),
    // Re-generate the teams page at most once per 1 hour
    revalidate: 60 * 60
  };
}
