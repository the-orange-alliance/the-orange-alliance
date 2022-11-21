import { Grid, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  ChartOptions,
  ChartData as _ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type Insight from '@the-orange-alliance/api/lib/cjs/models/Insights';
import useChartData from '../lib/utils/useChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);
const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
};

function Chart<
  P extends Insight,
  T extends Array<Exclude<keyof P, 'toJSON' | 'fromJSON' | `${string}Match`>>
>({
  options = defaultOptions,
  insights,
  keys,
  dataLabels,
  title,
  additionalChartData,
  labels,
  tension = 0.4
}: ChartProps<P, T>) {
  const chartData = useChartData<P, T>(insights, keys, dataLabels, tension, additionalChartData);
  console.log(chartData);

  return (
    <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
      <Typography variant={'h6'} align={'center'}>
        {title}
      </Typography>
      <Line data={{ ...chartData, labels }} options={{ ...options }} />
    </Grid>
  );
}

export interface ChartProps<
  P extends Insight,
  T extends Array<Exclude<keyof P, 'toJSON' | 'fromJSON' | `${string}Match`>>
> {
  insights: P[];
  keys: T;
  dataLabels: Record<T[number], string>;
  options?: Partial<ChartOptions<'line'>>;
  title: string;
  additionalChartData?: Omit<_ChartData<'line', number[], string>, 'datasets'>;
  tension?: number;
  labels: string[];
}

export default Chart;
