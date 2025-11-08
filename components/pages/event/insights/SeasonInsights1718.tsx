import RelicRecoveryInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/1718/RelicRecoveryInsights';
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

const SeasonInsights1718 = (props: IProps) => {
  const { insights } = props;

  const autoGlyphs = [];
  const glyphsCiphers = [];
  const endRelics = [];
  const percentStanding = [];
  const balanced = [];

  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;

    const insight: RelicRecoveryInsights = insights[key] as RelicRecoveryInsights;

    const short = getWeekShort(key);
    autoGlyphs.push({
      name: short,
      y1: insight.autoAverageGlyphs
    });
    glyphsCiphers.push({
      name: short,
      y1: insight.teleAverageGlyphs,
      y2: insight.teleAverageCiphers
    });
    endRelics.push({
      name: short,
      y1: insight.endAverageRelic1,
      y2: insight.endAverageRelic2,
      y3: insight.endAverageRelic3
    });
    percentStanding.push({
      name: short,
      y1: insight.endPercentRelicStanding
    });
    balanced.push({
      name: short,
      y1: insight.endAverageBalanced
    });
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Glyphs */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            Autonomous Glyphs
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={autoGlyphs}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Glyphs" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Glyphs/Ciphers */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            TeleOp Glyphs and Ciphers
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={glyphsCiphers}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Glyphs" />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Avg Ciphers" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Relics */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            End Game Relics
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={endRelics}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Relic 1" />
              <Line type="monotone" dataKey="y2" stroke={colors[1]} name="Avg Relic 2" />
              <Line type="monotone" dataKey="y3" stroke="#F44336" name="Avg Relic 3" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Relics Standing */}
        <Grid
          style={{ maxHeight: '300px' }}
          size={{
            sm: 12,
            md: 6
          }}
        >
          <Typography variant="h6" align="center">
            End Game Relics Standing
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={percentStanding}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Percent Standing" />
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
            End Game Balanced
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={balanced}
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
              <Line type="monotone" dataKey="y1" stroke={colors[0]} name="Avg Balanced" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SeasonInsights1718;
