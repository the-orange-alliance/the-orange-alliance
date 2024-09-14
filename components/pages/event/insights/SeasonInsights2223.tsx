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
import PowerPlayInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2223/PowerPlayInsights';
import { insightsGraphColors as colors } from '@/constants';
import { useTranslate } from '@/i18n/i18n';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights2122 = (props: IProps) => {
  const { insights } = props;

  const t = useTranslate();

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
      y2: insight.autoPercentSignalZone
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
      y4: insight.teleAverageGroundJunctions
    });
    teleTerminals.push({
      name: short,
      y1: insight.teleAverageTerminalFar,
      y2: insight.teleAverageTerminalNear
    });
    endNavigated.push({
      name: short,
      y1: insight.endPercentNavigated
    });
    endBeacons.push({
      name: short,
      y1: insight.endPercentBeacons,
      y2: insight.endAverageOwnedJunctions
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
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_signal_sleeves')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.percent_signal_sleeves')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Auto Parking */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_auto_parking')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.percent_terminal_substation')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y2"
                stroke={colors[1]}
                name={t('pages.event.subpages.insights.2223.percent_signal_zone')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Auto Cones */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_auto_cones')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.avg_high_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y2"
                stroke={colors[1]}
                name={t('pages.event.subpages.insights.2223.avg_mid_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y3"
                stroke={colors[2]}
                name={t('pages.event.subpages.insights.2223.avg_low_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y4"
                stroke={colors[3]}
                name={t('pages.event.subpages.insights.2223.avg_ground_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y5"
                stroke={colors[4]}
                name={t('pages.event.subpages.insights.2223.avg_terminal_general')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Cones */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_tele_cones')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.avg_high_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y2"
                stroke={colors[1]}
                name={t('pages.event.subpages.insights.2223.avg_mid_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y3"
                stroke={colors[2]}
                name={t('pages.event.subpages.insights.2223.avg_low_junction')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y4"
                stroke={colors[3]}
                name={t('pages.event.subpages.insights.2223.avg_ground_junction')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tele Terminals */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_tele_terminals')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.avg_terminal_far')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y2"
                stroke={colors[1]}
                name={t('pages.event.subpages.insights.2223.avg_terminal_near')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Navigation */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_end_nav')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.percent_navigated')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Beacons/Owned */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_end_beacons_owned')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.percent_beacons_used')}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y2"
                stroke={colors[1]}
                name={t('pages.event.subpages.insights.2223.avg_owned_junctions')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* End Circuits */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant="h6" align="center">
            {t('pages.event.subpages.insights.2223.title_end_circuits')}
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
              <Tooltip isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="y1"
                stroke={colors[0]}
                name={t('pages.event.subpages.insights.2223.percent_circuits')}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SeasonInsights2122;
