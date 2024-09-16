import { useMemo } from 'react';
import NextLink from 'next/link';
import { Button, Chip, Snackbar, Stack, Typography } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { MatchParticipant, Ranking } from '@the-orange-alliance/api/lib/cjs/models';
import { getLocationString } from '@/lib/utils/common';
import { useTranslate } from '@/i18n/i18n';
import theme from '@/lib/theme';

interface TeamSelectionBarProps {
  team: MatchParticipant | null;
  rankings: Ranking[];
}

const TeamSelectionBar: React.FC<TeamSelectionBarProps> = ({ team, rankings }) => {
  const t = useTranslate();
  const rank = useMemo(() => rankings.find(r => r.teamKey === team?.teamKey), [rankings, team]);

  return (
    <Snackbar
      open={team !== null && rank !== undefined}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      sx={{
        '& .MuiSnackbarContent-message': {
          width: '100%',
          px: 0.5,
          py: 1.5
        }
      }}
      message={
        rank ? (
          <>
            <Stack direction="row" gap={2} justifyContent="space-between" mb={0.5}>
              <Typography fontSize="1.125rem" fontWeight={500} lineHeight={1}>
                <strong>#{rank.teamKey}</strong> {rank.team.teamNameShort}
              </Typography>
              <Typography
                fontSize="0.875rem"
                sx={{
                  color: theme => (theme.palette.mode === 'dark' ? 'grey.600' : 'grey.400'),
                  mb: 1
                }}
              >
                {getLocationString(rank.team)}
              </Typography>
            </Stack>
            <Stack direction="row" gap={4} justifyContent="space-between">
              <Stack direction="row" gap={1}>
                <Chip
                  label={
                    <>
                      <strong>
                        {rank.wins}-{rank.losses}-{rank.ties}
                      </strong>{' '}
                      {t('match_table.wlt')}
                    </>
                  }
                  sx={{ color: '#5b21b6', bgcolor: '#ddd6fe' }}
                />
                <Chip
                  label={
                    <>
                      <strong>{rank.rank}</strong> {t('match_table.rank')}
                    </>
                  }
                  sx={{ color: '#065f46', bgcolor: '#99f6e4' }}
                />
                <Chip
                  label={
                    <>
                      <strong>{rank.played}</strong> {t('match_table.played')}
                    </>
                  }
                  sx={{ color: '#92400e', bgcolor: '#fde68a' }}
                />
              </Stack>
              <NextLink href={`/teams/${rank.teamKey}`} passHref>
                <Button
                  size="small"
                  color="inherit"
                  endIcon={<ArrowForwardIos />}
                  sx={{ textWrap: 'nowrap' }}
                >
                  {t('match_table.view_team')}
                </Button>
              </NextLink>
            </Stack>
          </>
        ) : null
      }
    />
  );
};

export default TeamSelectionBar;
