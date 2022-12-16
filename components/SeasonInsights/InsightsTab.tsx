import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import { Grid, Typography } from '@mui/material';
import { getWeekShort } from '../../lib/utils/common';
import SeasonInsights2122 from './SeasonInsights2122';
import SeasonInsights2021 from './SeasonInsights2021';
import SeasonInsights1920 from './SeasonInsights1920';
import SeasonInsights1819 from './SeasonInsights1819';
import SeasonInsights1718 from './SeasonInsights1718';
import Chart from '../Chart';
interface IProps {
  insights: { [key: string]: Insights };
  seasonKey: string;
}

const InsightsTab = (props: IProps) => {
  const { seasonKey } = props;
  const insights = Object.values(props.insights);
  const labels = Object.keys(props.insights).map(getWeekShort);

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Match Scores */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Match Scores',
            keys: ['averageMatchScore', 'averageWinningScore'],
            dataLabels: {
              averageMatchScore: 'Avg Match Score',
              averageWinningScore: 'Avg Winning Score'
            }
          }}
        />
        {/* Win Margin */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Average Win Margin',
            keys: ['averageWinningMargin'],
            dataLabels: {
              averageWinningMargin: 'Avg Win Margin'
            }
          }}
        />

        {/* Penalties */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Average Match Penalties',
            keys: ['averageMajorPenalties', 'averageMinorPenalties'],
            dataLabels: {
              averageMajorPenalties: 'Avg Major Penalties',
              averageMinorPenalties: 'Avg Minor Penalties'
            }
          }}
        />
      </Grid>

      <Typography variant={'h5'} align={'center'} sx={{ marginTop: 4 }}>
        <b>Season Specific</b>
      </Typography>

      {/* Season Specific */}
      {seasonKey === '2122' && <SeasonInsights2122 insights={props.insights} />}
      {seasonKey === '2021' && <SeasonInsights2021 insights={props.insights} />}
      {seasonKey === '1920' && <SeasonInsights1920 insights={props.insights} />}
      {seasonKey === '1819' && <SeasonInsights1819 insights={props.insights} />}
      {seasonKey === '1718' && <SeasonInsights1718 insights={props.insights} />}
    </>
  );
};

export default InsightsTab;
