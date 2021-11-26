import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import MatchBreakdown1617 from './MatchBreakdowns/MatchBreakdown1617';
import MatchBreakdown1718 from './MatchBreakdowns/MatchBreakdown1718';
import MatchBreakdown1819 from './MatchBreakdowns/MatchBreakdown1819';
import MatchBreakdown1920 from './MatchBreakdowns/MatchBreakdown1920';
import MatchBreakdown2021 from './MatchBreakdowns/MatchBreakdown2021';
import MatchBreakdown2122 from './MatchBreakdowns/MatchBreakdown2122';
import { MatchBreakdownRow, MatchBreakdownTitle } from './MatchBreakdownRow';
import { Box, Divider, Grid } from '@mui/material';

interface IProps {
  match: Match;
}
const MatchDetailsCard = (props: IProps) => {
  const { match } = props;

  let rows: MatchBreakdownRow[] = [];

  if (match.details) {
    switch (parseInt(match.matchKey.split('-')[0], 10)) {
      case 1617:
        rows = new MatchBreakdown1617().getRows(match);
        break;
      case 1718:
        rows = new MatchBreakdown1718().getRows(match);
        break;
      case 1819:
        rows = new MatchBreakdown1819().getRows(match);
        break;
      case 1920:
        rows = new MatchBreakdown1920().getRows(match);
        break;
      case 2021:
        rows = new MatchBreakdown2021().getRows(match);
        break;
      case 2122:
        rows = new MatchBreakdown2122().getRows(match);
        break;
      default:
        rows = [
          MatchBreakdownTitle('Autonomous', match.redAutoScore, match.blueAutoScore),
          MatchBreakdownTitle('Teleop', match.redTeleScore, match.blueTeleScore),
          MatchBreakdownTitle('End Game', match.redEndScore, match.blueEndScore),
          MatchBreakdownTitle('Penalty', match.bluePenalty, match.redPenalty)
        ];
        break;
    }
  } else if (match.blueAutoScore > -1) {
    rows = [
      MatchBreakdownTitle('Autonomous', match.redAutoScore, match.blueAutoScore),
      MatchBreakdownTitle('Teleop', match.redTeleScore, match.blueTeleScore),
      MatchBreakdownTitle('End Game', match.redEndScore, match.blueEndScore),
      MatchBreakdownTitle('Penalty', match.bluePenalty, match.redPenalty)
    ];
  }

  return rows.length > 0 ? (
    <Box className={'w-100 text-center'}>
      {rows.map(r => [
        <Grid key={r.name + r.isTitle + r.red + r.blue + '-row'} container>
          <Grid
            xs={4}
            item
            className={`red-bg ${r.isTitle ? 'win fw-bold' : ''} ${
              match.blueScore === -1 ? 'w-100' : ''
            } p-2`}
          >
            {r.redIcon}
            {r.getRedPoints()}
          </Grid>
          <Grid
            className={`${match.blueScore === -1 ? 'w-100' : ''} ${
              r.isTitle ? 'fw-bold grey-bg' : ''
            } p-2`}
            item
            xs={4}
          >
            {r.name}
          </Grid>
          {match.blueScore !== -1 && (
            <Grid item className={`blue-bg ${r.isTitle ? 'win fw-bold' : ''} p-2`} xs={4}>
              {r.blueIcon}
              {r.getBluePoints()}
            </Grid>
          )}
        </Grid>,
        <Divider
          key={r.name + r.isTitle + r.red + r.blue + '-divider'}
          style={{ opacity: '10%' }}
        />
      ])}
    </Box>
  ) : null;
};

export default MatchDetailsCard;
