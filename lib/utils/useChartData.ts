import type Insight from '@the-orange-alliance/api/lib/cjs/models/Insights';
import type { ChartData } from 'chart.js';
import { useMemo } from 'react';

export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 *
 * @param insight the array of insights
 * @param labels the labels for each key. The key is the key of the insight, and the value is the label for the chart
 */
function getChartDatasets<TInsight extends Insight>(
  insights: TInsight[],
  labels: Partial<Record<keyof PickByType<TInsight, number>, string | undefined>>
) {
  const data = objectKeys(labels).map(key => ({
    // @ts-ignore
    data: insights.map(insight => insight[key] as number),
    label: labels[key] as string
  }));
  return data;
}

function useChartData<TInsight extends Insight>(
  insights: TInsight[],
  labels: Partial<Record<keyof PickByType<TInsight, number>, string>>,
  tension: number,
  additionalChartData?: Omit<ChartData<'line', number[], string>, 'datasets'>
) {
  return useMemo<ChartData<'line', number[], string>>(() => {
    const colors = ['#6200EE', '#03DAC6', '#F44336', '#29b6f6'];
    return {
      datasets: getChartDatasets<TInsight>(insights, labels).map((dataset, index) => ({
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
  }, [insights, labels, additionalChartData, tension]);
}

function objectKeys<T extends Record<string, unknown>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export { getChartDatasets };
export default useChartData;
