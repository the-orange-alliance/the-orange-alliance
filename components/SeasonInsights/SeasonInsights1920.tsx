import SkystoneInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/1920/SkystoneInsights';
import { Grid, Typography } from '@mui/material';
import { getWeekShort } from '../../lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import Chart from '../Chart';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights1920 = (props: IProps) => {
  const insights = Object.values(props.insights) as SkystoneInsights[];
  const labels = Object.keys(props.insights).map(getWeekShort);

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Stones */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              autoAverageSkystonesDelivered: 'Avg Skystones Delivered',
              autoAverageStonesDelivered: 'Avg Stones Delivered',
              autoAveragePlaced: 'Avg Stones Placed'
            },
            title: 'Autonomous Stones'
          }}
        />

        {/* Robot Parking */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              autoPercentParked: 'Percent Robots Parked',
              autoPercentNaved: 'Percent Robots Navigated'
            },
            title: 'Autonomous Movement'
          }}
        />

        {/* Foundation */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              percentFoundationMoved: 'Percent Foundation Moved',
              percentFoundationRepositioned: 'Percent Foundation Repositioned'
            },
            title: 'Foundation'
          }}
        />

        {/* Tele Stones */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              teleAverageReturned: 'Avg Returned',
              teleAverageDelivered: 'Avg Delivered',
              teleAveragePlaced: 'Avg Placed'
            },
            title: 'Teleop Stones'
          }}
        />

        {/* End Capping */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              endAverageCapLevel: 'Avg Cap Level'
            },
            title: 'End Game Capping'
          }}
        />

        {/* End Balanced */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              endAverageTowerBonus: 'Avg Tower Bonus',
              endAverageCapBonus: 'Avg Cap Bonus',
              endAverageLevelBonus: 'Avg Level Bonus'
            },
            title: 'End Game Bonus'
          }}
        />

        {/* End Parked */}
        <Chart
          {...{
            labels,
            insights,
            dataLabels: {
              endPercentParked: 'Percent Parked'
            },
            title: 'End Game Parking'
          }}
        />
      </Grid>
    </>
  );
};

export default SeasonInsights1920;
