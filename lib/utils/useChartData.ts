import FreightFrenzyInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2122/FreightFrenzyInsights';
import { ChartData } from '../../components/Chart';
import type Insight from '@the-orange-alliance/api/lib/cjs/models/Insights';
import { useMemo } from 'react';

/**
 *
 * @param insight the array of insights
 * @param keys the keys to get the data from
 * @param labels the labels for each key
 */
function getChartDatasets<
  P extends Insight,
  T extends Array<Exclude<keyof P, 'toJSON' | 'fromJSON' | `${string}Match`>>
>(insights: P[], keys: T, labels: Record<T[number], string>) {
  return keys.map(key => {
    return {
      data: insights.map(insight =>
        // not sure why i have to "as number" it, but it shouldn't throw errors in runtime bc I made sure it's a number
        typeof insight[key] === 'number' ? insight[key] : -1
      ),
      label: typeof labels[key] === 'string' ? (labels[key] as string) : String(key)
    };
  });
}

function useChartData<
  P extends Insight,
  T extends Array<Exclude<keyof P, 'toJSON' | 'fromJSON' | `${string}Match`>>
>(insights: P[], keys: T, labels: Record<T[number], string>) {
  return useMemo(() => getChartDatasets<P, T>(insights, keys, labels), [insights, keys, labels]);
}

export { getChartDatasets };
export default useChartData;
