import FreightFrenzyInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2122/FreightFrenzyInsights';
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
type InsightsData<T extends string> = ({
  name: string;
} & Record<T, number>)[];

const SeasonInsights2122 = (props: IProps) => {
  const { insights } = props;
  const insightsNew = Object.values(insights) as FreightFrenzyInsights[];

  const autoFreight: InsightsData<'y1' | 'y2' | 'y3' | 'y4'> = [];
  const autoParking: InsightsData<'y1' | 'y2' | 'y3' | 'y4'> = [];
  const autoBonuses: InsightsData<'y1'> = [];
  const teleFreight: InsightsData<'y1' | 'y2' | 'y3' | 'y4'> = [];
  const endDelivered: InsightsData<'y1'> = [];
  const endBalanced: InsightsData<'y1' | 'y2'> = [];
  const endCapped: InsightsData<'y1'> = [];
  const endCarousel: InsightsData<'y1'> = [];
  const endParking: InsightsData<'y1' | 'y2'> = [];

  const labels = Object.keys(insights).map(getWeekShort);

  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight = insights[key] as FreightFrenzyInsights;

    const short = getWeekShort(key);
    autoFreight.push({
      name: short,
      y1: insight.autoAverageFreight1,
      y2: insight.autoAverageFreight2,
      y3: insight.autoAverageFreight3,
      y4: insight.autoAverageStorageFreight
    });
    autoParking.push({
      name: short,
      y1: insight.autoAveragePartialWarehouse,
      y2: insight.autoAverageCompleteWarehouse,
      y3: insight.autoAveragePartialStorage,
      y4: insight.autoAverageCompleteStorage
    });
    autoBonuses.push({
      name: short,
      y1: insight.autoAverageBonus
    });
    teleFreight.push({
      name: short,
      y1: insight.teleAverageFreight1,
      y2: insight.teleAverageFreight2,
      y3: insight.teleAverageFreight3,
      y4: insight.teleAverageSharedFreight
    });
    endDelivered.push({
      name: short,
      y1: insight.endAverageDelivered
    });
    endBalanced.push({
      name: short,
      y1: insight.endAverageHubBalanced,
      y2: insight.endAverageSharedHubUnbalanced
    });
    endCapped.push({
      name: short,
      y1: insight.averageCapped
    });
    endCarousel.push({
      name: short,
      y1: insight.averageCarousel
    });
    endParking.push({
      name: short,
      y1: insight.endParkedPartialWarehouse,
      y2: insight.endParkedCompleteWarehouse
    });
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Freight */}
        <Chart
          insights={insightsNew}
          keys={[
            'autoAverageFreight1',
            'autoAverageFreight2',
            'autoAverageFreight3',
            'autoAverageStorageFreight'
          ]}
          dataLabels={{
            autoAverageFreight1: 'Avg Lvl 1 Freight',
            autoAverageFreight2: 'Avg Lvl 2 Freight',
            autoAverageFreight3: 'Avg Lvl 3 Freight',
            autoAverageStorageFreight: 'Avg Storage Freight'
          }}
          title="Autonomous Freight"
          labels={labels}
        />

        {/* Auto Parking */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Parking
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoParking}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Partial Warehouse" />
              <Line type="monotone" dataKey="y2" stroke="#03DAC6" name="Avg Complete Warehouse" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Partial Storage" />
              <Line type="monotone" dataKey="y4" stroke="#29b6f6" name="Avg Complete Storage" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Auto Bonuses */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Bonuses
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoBonuses}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Bonuses Received" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Freight */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            TeleOp Freight
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={teleFreight}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Lvl 1 Freight" />
              <Line type="monotone" dataKey="y2" stroke="#03DAC6" name="Avg Lvl 2 Freight" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Lvl 3 Freight" />
              <Line type="monotone" dataKey="y4" stroke="#29b6f6" name="Avg Shared Freight" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Delivered */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Delivered
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endDelivered}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Delivered" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Balanced */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Balanced
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endBalanced}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Alliance Balanced" />
              <Line type="monotone" dataKey="y1" stroke="#03DAC6" name="Avg Shared Unbalanced" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Capped */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Capped
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endCapped}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Capped" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Carousel */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Carousel
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endCapped}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Carousel" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Parking */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Parking
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endParking}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="y1"
                stroke="#6200EE"
                name="Percent Partial Warehouse"
              />
              <Line
                type="monotone"
                dataKey="y1"
                stroke="#6200EE"
                name="Percent Complete Warehouse"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SeasonInsights2122;
