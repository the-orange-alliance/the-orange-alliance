import UltimateGoalInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2021/UltimateGoalInsights';
import { Grid } from '@mui/material';
import { getWeekShort } from '../../lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import Chart from '../Chart';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights2021 = (props: IProps) => {
  const insights = Object.values(props.insights) as UltimateGoalInsights[];
  const labels = Object.keys(props.insights).map(getWeekShort);

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Rings */}
        <Chart
          {...{
            labels,
            insights,
            title: 'Autonomous Rings',
            dataLabels: {
              autoAverageRingsScoredHigh: 'Avg High Rings',
              autoAverageRingsScoredMid: 'Avg Mid Rings',
              autoAverageRingsScoredLow: 'Avg Low Rings'
            }
          }}
        />

        {/* Navigated */}
        <Chart
          {...{
            labels,
            insights,
            title: 'Autonomous Navigation',
            dataLabels: {
              autoPercentNavigated: 'Percent Navigated'
            }
          }}
        />

        {/* Auto Wobbles */}
        <Chart
          {...{
            labels,
            insights,
            title: 'Autonomous Wobbles Delivered',
            dataLabels: {
              autoPercentWobblesDelivered: 'Avg Wobbles Delivered'
            }
          }}
        />

        {/* Tele Rings */}
        <Chart
          {...{
            labels,
            insights,
            title: 'Teleop Rings',
            dataLabels: {
              teleAverageRingsScoredHigh: 'Avg High Rings',
              teleAverageRingsScoredMid: 'Avg Mid Rings',
              teleAverageRingsScoredLow: 'Avg Low Rings'
            }
          }}
        />

        {/* PowerShots */}
        <Chart
          {...{
            labels,
            insights,
            title: 'Power Shots',
            dataLabels: {
              autoAveragePowerShots: 'Avg PowerShots Autonomous',
              endAveragePowerShots: 'Avg PowerShots Endgame'
            }
          }}
        />
        {/* End Wobbles */}
        <Chart
          {...{
            labels,
            insights,
            title: 'End Game Wobble Location',
            dataLabels: {
              endPercentWobblesOnStart: 'Percent Wobbles On Start',
              endPercentWobblesInDropZone: 'Percent Wobbles In Drop Zone'
            }
          }}
        />
      </Grid>
    </>
  );
};

export default SeasonInsights2021;
