import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
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
import { getWeekShort } from '../../util/common-utils';
import SeasonInsights2122 from './SeasonInsights2122';
import SeasonInsights2021 from './SeasonInsights2021';
import SeasonInsights1920 from './SeasonInsights1920';
import SeasonInsights1819 from './SeasonInsights1819';
import SeasonInsights1718 from './SeasonInsights1718';
interface IProps {
  insights: { [key: string]: Insights };
  seasonKey: string;
}

const InsightsTab = (props: IProps) => {
  const { insights, seasonKey } = props;

  const matchScoresData = [];
  const winMarginData = [];
  const avgPenaltiesData = [];

  for (const key in insights) {
    if (typeof key === 'string' && key.toLowerCase() === 'test') continue;
    const short = getWeekShort(key);
    matchScoresData.push({
      name: short,
      y1: insights[key].averageMatchScore,
      y2: insights[key].averageWinningScore
    });
    winMarginData.push({
      name: short,
      y1: insights[key].averageWinningMargin
    });
    avgPenaltiesData.push({
      name: short,
      y1: insights[key].averageMajorPenalties,
      y2: insights[key].averageMinorPenalties
    });
  }

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Match Scores */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Average Match Scores
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={matchScoresData}
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
                name="Avg Match Score"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="y2"
                stroke="#03DAC6"
                name="Avg Winning Score"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Win Margin */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Average Win Margin
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={winMarginData}
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
                name="Avg Win Margin"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Penalties */}
        <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
          <Typography variant={'h6'} align={'center'}>
            Average Match Penalties
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={400}
              height={300}
              data={avgPenaltiesData}
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
                name="Avg Major Penalties"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="y2"
                stroke="#6200EE"
                name="Avg Minor Penalties"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      <Typography variant={'h5'} align={'center'} sx={{ marginTop: 4 }}>
        <b>Season Specific</b>
      </Typography>

      {/* Season Specific */}
      {seasonKey === '2122' && <SeasonInsights2122 insights={insights} />}
      {seasonKey === '2021' && <SeasonInsights2021 insights={insights} />}
      {seasonKey === '1920' && <SeasonInsights1920 insights={insights} />}
      {seasonKey === '1819' && <SeasonInsights1819 insights={insights} />}
      {seasonKey === '1718' && <SeasonInsights1718 insights={insights} />}
    </>
  );
};

export default InsightsTab;
