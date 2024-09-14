import RoverRuckusInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/1819/RoverRuckusInsights';
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
import { getWeekShort } from '../../../../lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import { insightsGraphColors as colors } from '../../../../constants';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights1819 = (props: IProps) => {
  const { insights } = props;

  const landing = [];
  const sampleClaim = [];
  const parking = [];
  const teleAvg = [];
  const endNav = [];

  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight: RoverRuckusInsights = insights[key] as RoverRuckusInsights;

    const short = getWeekShort(key);
    landing.push({
      name: short,
      y1: insight.autoPercentLanding
    });
    sampleClaim.push({
      name: short,
      y1: insight.autoPercentSampling,
      y2: insight.autoPercentClaiming
    });
    parking.push({
      name: short,
      y1: insight.autoPercentParking
    });
    teleAvg.push({
      name: short,
      y1: insight.teleAvgGolds,
      y2: insight.teleAvgSilvers,
      y3: insight.teleAvgDepotMinerals
    });
    endNav.push({
      name: short,
      y1: insight.endPercentLatched,
      y2: insight.endPercentParked
    });
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Landing */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            Autonomous Landing
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={landing}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Percent Landed" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Sample/Claiming */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            Autonomous Sample/Claiming
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={sampleClaim}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Percent Sampled" />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Percent Claimed" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Parking */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            Autonomous Parking
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={parking}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Percent Parked" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Scoring */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            TeleOp Gold, Silver, and Depot
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={teleAvg}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Gold" />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Avg Silver" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Depot Minerals" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Parking */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            End Game Parking
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endNav}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Percent Latched" />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Percent Parked" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SeasonInsights1819;
