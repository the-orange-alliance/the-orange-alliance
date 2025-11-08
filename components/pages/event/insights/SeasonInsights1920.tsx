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
import { getWeekShort } from '@/lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import { insightsGraphColors as colors } from '@/constants';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights1920 = (props: IProps) => {
  const { insights } = props;

  const autoStones = [];
  const robotAuton = [];
  const foundation = [];
  const teleStones = [];
  const averageCapLevel = [];
  const bonuses = [];
  const percentParked = [];

  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight: SkystoneInsights = insights[key] as SkystoneInsights;

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
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            Autonomous Stones
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoStones}
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
                stroke={colors[0]}
                name="Avg Skystones Delivered"
              />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Avg Stones Delivered" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Stones Placed" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Robot Parking */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            Autonomous Movement
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={robotAuton}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Percent Robots Parked" />
              <Line
                type="monotone"
                dataKey="y2"
                stroke={colors[1]}
                name="Percent Robots Navigated"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Foundation */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            Foundation
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={foundation}
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
                stroke={colors[0]}
                name="Percent Foundations Moved"
              />
              <Line
                type="monotone"
                dataKey="y2"
                stroke={colors[1]}
                name="Percent Foundations Repositioned"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Stones */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            TeleOp Stones
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={teleStones}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Returned" />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Avg Delivered" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Placed" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Capping */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            End Game Capping
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={averageCapLevel}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Cap Level" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Balanced */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            End Game Bonus
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={bonuses}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Tower Bonus" />
              <Line type="monotone" dataKey="y1" stroke={colors[1]} name="Avg Cap Bonus" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Level Bonus" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Parked */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            End Game Parking
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={percentParked}
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
      </Grid>
    </>
  );
};

export default SeasonInsights1920;
