import { Grid, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  ChartOptions,
  Tooltip,
  ChartData as _ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type Insight from '@the-orange-alliance/api/lib/cjs/models/Insights';
import useChartData, { PickByType } from '../lib/utils/useChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
};

function Chart<TInsight extends Insight>({
  options = defaultOptions,
  insights,
  dataLabels,
  title,
  additionalChartData,
  labels,
  tension = 0.4
}: ChartProps<TInsight>) {
  const chartData = useChartData<TInsight>(insights, dataLabels, tension, additionalChartData);

  return (
    <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
      <Typography variant={'h6'} align={'center'}>
        {title}
      </Typography>
      <Line data={{ ...chartData, labels }} options={{ ...options }} />
    </Grid>
  );
}

export interface ChartProps<TInsight extends Insight> {
  /**
   * The actual array of insights
   */
  insights: TInsight[];
  /**
   * This is an object, where the key of the object is the key of the data in the "Insight",
   *  and the value of the object is the title that is shown when this data is displayed on the actual chart.
   *
   * ```tsx
   * <Chart dataLabels={foo:"1", baz: "2"} ... />
   * ```
   * would display a chart with insights.foo and insights.baz, with the titles 1 and 2 respectively
   */
  dataLabels: Partial<Record<keyof PickByType<TInsight, number>, string>>;
  options?: Partial<ChartOptions<'line'>>;
  /**
   * This is the title of the whole chart
   */
  title: string;
  additionalChartData?: Omit<_ChartData<'line', number[], string>, 'datasets'>;
  tension?: number;
  /**
   * This is the data shown on the x axis of the chart.
   * ```ts
   * const labels = Object.keys(props.insights).map(getWeekShort);
   * ```
   * getWeekShort is in the src/lib/common.ts file
   */
  labels: string[];
}

export default Chart;
