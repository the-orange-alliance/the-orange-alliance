import FreightFrenzyInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2122/FreightFrenzyInsights';
import { Grid } from '@mui/material';
import { getWeekShort } from '../../lib/utils/common';
import type { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import Chart from '../Chart';

interface IProps {
  insights: { [key: string]: Insights };
}
type InsightsData<T extends string> = ({
  name: string;
} & Record<T, number>)[];

const SeasonInsights2122 = (props: IProps) => {
  const insights = Object.values(props.insights) as FreightFrenzyInsights[];
  const labels = Object.keys(props.insights).map(getWeekShort);

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Freight */}
        <Chart
          {...{
            insights,
            labels,
            keys: [
              'autoAverageFreight1',
              'autoAverageFreight2',
              'autoAverageFreight3',
              'autoAverageStorageFreight'
            ],
            dataLabels: {
              autoAverageFreight1: 'Avg Lvl 1 Freight',
              autoAverageFreight2: 'Avg Lvl 2 Freight',
              autoAverageFreight3: 'Avg Lvl 3 Freight',
              autoAverageStorageFreight: 'Avg Storage Freight'
            },
            title: 'Autonomous Freight'
          }}
        />

        {/* Auto Parking */}
        <Chart
          {...{
            insights,
            labels,
            keys: [
              'autoAveragePartialWarehouse',
              'autoAverageCompleteWarehouse',
              'autoAveragePartialStorage',
              'autoAverageCompleteStorage'
            ],
            dataLabels: {
              autoAveragePartialWarehouse: 'Avg Partial Warehouse',
              autoAverageCompleteWarehouse: 'Avg Complete Warehouse',
              autoAveragePartialStorage: 'Avg Partial Storage',
              autoAverageCompleteStorage: 'Avg Complete Storage'
            },
            title: 'Autonomous Parking'
          }}
        />

        {/* Auto Bonuses */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['autoAverageBonus'],
            dataLabels: {
              autoAverageBonus: 'Percent Bonuses Received'
            },
            title: 'Autonomous Bonuses'
          }}
        />

        {/* Tele Freight */}
        <Chart
          {...{
            insights,
            labels,
            keys: [
              'teleAverageFreight1',
              'teleAverageFreight2',
              'teleAverageFreight3',
              'teleAverageSharedFreight'
            ],
            dataLabels: {
              teleAverageFreight1: 'Avg Lvl 1 Freight',
              teleAverageFreight2: 'Avg Lvl 2 Freight',
              teleAverageFreight3: 'Avg Lvl 3 Freight',
              teleAverageSharedFreight: 'Avg Shared Freight'
            },
            title: 'Teleop Freight'
          }}
        />

        {/* End Delivered */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['endAverageDelivered'],
            dataLabels: {
              endAverageDelivered: 'Avg Freight Delivered'
            },
            title: 'End Game Delivered'
          }}
        />

        {/* End Balanced */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['endAverageHubBalanced', 'endAverageSharedHubUnbalanced'],
            dataLabels: {
              endAverageHubBalanced: 'Avg Alliance Balanced',
              endAverageSharedHubUnbalanced: 'Avg Shared Unbalanced'
            },
            title: 'End Game Balanced'
          }}
        />

        {/* End Capped */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['averageCapped'],
            dataLabels: {
              averageCapped: 'Percent Capped'
            },
            title: 'End Game Capped'
          }}
        />

        {/* End Carousel */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['averageCarousel'],
            dataLabels: {
              averageCarousel: 'Percent Carousel'
            },
            title: 'End Game Carousel'
          }}
        />

        {/* End Parking */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['endParkedPartialWarehouse', 'endParkedCompleteWarehouse'],
            dataLabels: {
              endParkedPartialWarehouse: 'Percent Partial Warehouse',
              endParkedCompleteWarehouse: 'Percent Complete Warehouse'
            },
            title: 'End Game Parking'
          }}
        />
      </Grid>
    </>
  );
};

export default SeasonInsights2122;
