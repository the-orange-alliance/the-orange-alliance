import NextLink from 'next/link';
import { Table, TableHead, TableRow, TableCell, TableBody, Link, Box } from '@mui/material';
import { Ranking, Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '@/i18n/i18n';

interface IProps {
  event: Event;
}

const RankingTab = (props: IProps) => {
  const { rankings } = props.event;
  const t = useTranslate();

  return (
    <div style={{ overflowY: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('pages.event.subpages.rankings.rank')}</TableCell>
            <TableCell>{t('pages.event.subpages.rankings.team')}</TableCell>
            <TableCell>RP</TableCell>
            <TableCell>TBP</TableCell>
            <TableCell>{t('pages.event.subpages.rankings.highest_score')}</TableCell>
            <TableCell>{t('pages.event.subpages.rankings.matches_played')}</TableCell>
            <TableCell>OPR</TableCell>
            <TableCell>NP-OPR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankings.map((row: Ranking) => (
            <TableRow key={row.team.teamNumber}>
              <TableCell>{row.rank}</TableCell>
              <TableCell>
                <NextLink href={`/teams/${row.team.teamNumber}`} passHref legacyBehavior>
                  <Link underline="hover">
                    #{row.team.teamNumber}
                    <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, ml: 1 }}>
                      {row.team.teamNameShort}
                    </Box>
                  </Link>
                </NextLink>
              </TableCell>
              <TableCell>{row.rankingPoints.toFixed(2)}</TableCell>
              <TableCell>{row.tieBreakerPoints.toFixed(2)}</TableCell>
              <TableCell>{row.highestQualScore}</TableCell>
              <TableCell>{row.played}</TableCell>
              <TableCell>{row?.opr?.toFixed(2) ?? 0}</TableCell>
              <TableCell>{row?.npOpr?.toFixed(2) ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RankingTab;
