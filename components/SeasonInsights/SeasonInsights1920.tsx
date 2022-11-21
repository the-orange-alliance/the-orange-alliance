import SkystoneInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/1920/SkystoneInsights';
import { Grid, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getWeekShort } from '../../lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import Chart from '../Chart';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights1920 = (props: IProps) => {
  const insights = Object.values(props.insights) as SkystoneInsights[];
  const labels = Object.keys(props.insights).map(getWeekShort);
  const autoStones = [];
  const robotAuton = [];
  const foundation = [];
  const teleStones = [];
  const averageCapLevel = [];
  const bonuses = [];
  const percentParked = [];

  for (const key in props.insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight: SkystoneInsights = props.insights[key] as SkystoneInsights;

    const short = getWeekShort(key);
    autoStones.push({
      name: short,
      y1: insight.autoAverageSkystonesDelivered,
      y2: insight.autoAverageStonesDelivered,
      y3: insight.autoAveragePlaced
    });
    robotAuton.push({
      name: short,
      y1: insight.autoPercentParked,
      y2: insight.autoPercentNaved
    });
    foundation.push({
      name: short,
      y1: insight.percentFoundationMoved,
      y2: insight.percentFoundationRepositioned
    });
    teleStones.push({
      name: short,
      y1: insight.teleAverageReturned,
      y2: insight.teleAverageDelivered,
      y3: insight.teleAveragePlaced
    });
    averageCapLevel.push({
      name: short,
      y1: insight.endAverageCapLevel
    });
    bonuses.push({
      name: short,
      y1: insight.endAverageTowerBonus,
      y2: insight.endAverageCapBonus,
      y3: insight.endAverageLevelBonus
    });
    percentParked.push({
      name: short,
      y1: insight.endPercentParked
    });
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Stones */}
        <Chart
          {...{
            labels,
            insights,
            keys: [
              'autoAverageSkystonesDelivered',
              'autoAverageStonesDelivered',
              'autoAveragePlaced'
            ],
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
            keys: ['autoPercentParked', 'autoPercentNaved'],
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
            keys: ['percentFoundationMoved', 'percentFoundationRepositioned'],
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
            keys: ['teleAverageReturned', 'teleAverageDelivered', 'teleAveragePlaced'],
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
            keys: ['endAverageCapLevel'],
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
            keys: ['endAverageTowerBonus', 'endAverageCapBonus', 'endAverageLevelBonus'],
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
            keys: ['endPercentParked'],
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
