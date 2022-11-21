import type Insight from '@the-orange-alliance/api/lib/cjs/models/Insights';
import type { ChartData } from 'chart.js';
import { useMemo } from 'react';

/**
 *
 * @param insight the array of insights
 * @param keys the keys to get the data from
 * @param labels the labels for each key
 */
function getChartDatasets<
  P extends Insight,
  // TODO: make T = Array<keyof P> where P is a number
  T extends Array<Exclude<keyof P, 'toJSON' | 'fromJSON' | `${string}Match`>>
>(insights: P[], keys: T, labels: Record<T[number], string>) {
  const data = keys.map(key => {
    return {
      data: insights.map(insight =>
        // not sure why i have to "as number" it, but it shouldn't throw errors in runtime bc I made sure it's a number
        typeof insight[key] === 'number' ? (insight[key] as unknown as number) : -1
      ),
      label: typeof labels[key] === 'string' ? (labels[key] as string) : String(key)
    };
  });
  // console.log(data);
  return data;
}

function useChartData<
  P extends Insight,
  T extends Array<Exclude<keyof P, 'toJSON' | 'fromJSON' | `${string}Match`>>
>(
  insights: P[],
  keys: T,
  labels: Record<T[number], string>,
  tension: number,
  additionalChartData?: Omit<ChartData<'line', number[], string>, 'datasets'>
) {
  return useMemo<ChartData<'line', number[], string>>(() => {
    const colors = ['#6200EE', '#03DAC6', '#F44336', '#29b6f6'];
    return {
      datasets: getChartDatasets<P, T>(insights, keys, labels).map((dataset, index) => ({
        data: dataset.data,
        label: dataset.label,
        tension,
        borderColor: colors[index],
        backgroundColor: colors[index],
        pointBorderColor: colors[index],
        borderWidth: 1,
        pointBackgroundColor: '#FFFFFF'
      })),
      ...additionalChartData
    };
  }, [insights, keys, labels, additionalChartData, tension]);
}

export { getChartDatasets };
export default useChartData;
