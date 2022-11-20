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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);
const defaultOptions: ChartOptions<'line'> = {
  responsive: true,

  plugins: {
    legend: {
      position: 'top' as const
    }
  }
};

const Chart: React.FC<ChartProps> = ({ data, title, options = defaultOptions, tension = 0.4 }) => {
  const colors = ['#6200EE', '#03DAC6', '#F44336', '#29b6f6'];
  const newData: _ChartData<'line', number[], string> = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      tension,
      borderColor: colors[index],
      backgroundColor: colors[index],
      pointBorderColor: colors[index],
      borderWidth: 1,
      pointBackgroundColor: '#FFFFFF'
    }))
  };

  return (
    <Grid item sm={12} md={6} style={{ maxHeight: '300px' }}>
      <Typography variant={'h6'} align={'center'}>
        {title}
      </Typography>
      <Line data={newData} options={{ ...options }} />
    </Grid>
  );
};

export interface ChartProps {
  data: Omit<_ChartData<'line', number[], string>, 'datasets'> & {
    datasets: { label: string; data: number[] }[];
  };
  options?: Partial<ChartOptions<'line'>>;
  title: string;
  tension?: number;
}

export type ChartData = ChartProps['data'];

export default Chart;
