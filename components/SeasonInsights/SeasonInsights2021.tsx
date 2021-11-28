import UltimateGoalInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2021/UltimateGoalInsights';
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

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights2021 = (props: IProps) => {
  const { insights } = props;

  const autoRings = [];
  const teleRings = [];
  const powerShots = [];
  const nav = [];
  const wobbles = [];
  const wobblesEnd = [];

  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight: UltimateGoalInsights = insights[key] as UltimateGoalInsights;

    const short = getWeekShort(key);
    autoRings.push({
      name: short,
      y1: insight.autoAverageRingsScoredHigh,
      y2: insight.autoAverageRingsScoredMid,
      y3: insight.autoAverageRingsScoredLow
    });
    teleRings.push({
      name: short,
      y1: insight.teleAverageRingsScoredHigh,
      y2: insight.teleAverageRingsScoredMid,
      y3: insight.teleAverageRingsScoredLow
    });
    powerShots.push({
      name: short,
      y1: insight.autoAveragePowerShots,
      y2: insight.endAveragePowerShots
    });
    nav.push({
      name: short,
      y1: insight.autoPercentNavigated
    });
    wobbles.push({
      name: short,
      y1: insight.autoPercentWobblesDelivered
    });
    wobblesEnd.push({
      name: short,
      y1: insight.endPercentWobblesOnStart,
      y2: insight.endPercentWobblesInDropZone
    });
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Rings */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Rings
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoRings}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg High Rings" />
              <Line type="monotone" dataKey="y2" stroke="#03DAC6" name="Avg Mid Rings" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Low Rings" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Navigated */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Navigation
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={nav}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Navigated" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Auto Wobbles */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Wobbles Delivered
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={wobbles}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Wobbles Delivered" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Rings */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            TeleOp Rings
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={teleRings}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg High Rings" />
              <Line type="monotone" dataKey="y2" stroke="#03DAC6" name="Avg Mid Rings" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Low Rings" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* PowerShots */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            PowerShots
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={powerShots}
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
                name="Avg PowerShots Autonomous"
              />
              <Line
                type="monotone"
                dataKey="y2"
                stroke="#03DAC6"
                name="Avg PowerShots Autonomous"
              />
              <Line type="monotone" dataKey="y1" stroke="#03DAC6" name="Avg PowerShots End" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Wobbles */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Wobble Location
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={wobblesEnd}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Wobbles on Start" />
              <Line
                type="monotone"
                dataKey="y1"
                stroke="#03DAC6"
                name="Percent Wobbles in Drop Zone"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SeasonInsights2021;
