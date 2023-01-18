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
import PowerPlayInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2223/PowerPlayInsights';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights2122 = (props: IProps) => {
  const { insights } = props;

  const autoSignalSleeves = [];
  const autoParked = [];
  const autoCones = [];
  const teleJunctions = [];
  const teleTerminals = [];
  const endNavigated = [];
  const endBeacons = [];
  const endCircuits = [];
  
  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight = insights[key] as PowerPlayInsights;

    const short = getWeekShort(key);
    autoSignalSleeves.push({
      name: short,
      y1: insight.autoPercentSignalSleeves
    });
    autoParked.push({
      name: short,
      y1: insight.autoPercentTerminalSubstation,
      y2: insight.autoPercentSignalZone,
    });
    autoCones.push({
      name: short,
      y1: insight.autoAverageHighJunctions,
      y2: insight.autoAverageMidJunctions,
      y3: insight.autoAverageLowJunctions,
      y4: insight.autoAverageGroundJunctions,
      y5: insight.autoAverageTerminal
    });
    teleJunctions.push({
      name: short,
      y1: insight.teleAverageHighJunctions,
      y2: insight.teleAverageMidJunctions,
      y3: insight.teleAverageLowJunctions,
      y4: insight.teleAverageGroundJunctions,
    });
    teleTerminals.push({
      name: short,
      y1: insight.teleAverageTerminalFar,
      y2: insight.teleAverageTerminalNear,
    });
    endNavigated.push({
      name: short,
      y1: insight.endPercentNavigated
    });
    endBeacons.push({
      name: short,
      y1: insight.endPercentBeacons,
      y2: insight.endAverageOwnedJunctions,
    });
    endCircuits.push({
      name: short,
      y1: insight.endPercentCircuits
    });
    
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Signal Sleeves */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Signal Sleeves
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoSignalSleeves}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Signal Sleeves Used" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Auto Parking */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Parking
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoParked}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent in Terminal/Substation" />
              <Line type="monotone" dataKey="y2" stroke="#03DAC6" name="Percent in Signal Zone" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Auto Cones */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Autonomous Junctions/Terminals
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoCones}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg High Junctions" />
              <Line type="monotone" dataKey="y2" stroke="#6200EE" name="Avg Mid Junctions" />
              <Line type="monotone" dataKey="y3" stroke="#6200EE" name="Avg Low Junctions" />
              <Line type="monotone" dataKey="y4" stroke="#6200EE" name="Avg Ground Junctions" />
              <Line type="monotone" dataKey="y5" stroke="#6200EE" name="Avg in Terminal" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Cones */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Driver-Controlled Junctions
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={teleJunctions}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg High Junctions" />
              <Line type="monotone" dataKey="y2" stroke="#6200EE" name="Avg Mid Junctions" />
              <Line type="monotone" dataKey="y3" stroke="#6200EE" name="Avg Low Junctions" />
              <Line type="monotone" dataKey="y4" stroke="#6200EE" name="Avg Ground Junctions" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Terminals */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Terminals
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={teleTerminals}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Terminal Far" />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Terminal Near" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Navigation */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Navigated
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endNavigated}
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

        {/* End Beacons/Owned */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Beacons/Owned Junctions
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endBeacons}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Beacons Used" />
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Avg Owned Junctions" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Circuits */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            End Game Circuits
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endCircuits}
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
              <Line type="monotone" dataKey="y1" stroke="#6200EE" name="Percent Circuits Acheived" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SeasonInsights2122;
