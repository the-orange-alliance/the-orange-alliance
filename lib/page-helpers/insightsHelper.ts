import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { undefinedToNull } from '../../lib/utils/common';
import { getInsightsType } from '@the-orange-alliance/api/lib/cjs/models/game-specifics/InsightsData';
import { CURRENT_SEASON } from '../../constants';

interface IRawInsightsProps {
  qualsSingleTeam: { [key: string]: any };
  qualsMultiTeam: { [key: string]: any };
  elimsMultiTeam: { [key: string]: any };
  combo: { [key: string]: any[] };
  seasonKey: string;
}

interface IInsightsProps {
  qualsSingleTeam: { [key: string]: Insights };
  qualsMultiTeam: { [key: string]: Insights };
  elimsMultiTeam: { [key: string]: Insights };
  combo: { [key: string]: Insights };
  seasonKey: string;
}

const parseInsightsProps = (props: IRawInsightsProps): IInsightsProps => {
  const qualsSingleTeam = {} as { [key: string]: Insights };
  const qualsMultiTeam = {} as { [key: string]: Insights };
  const elimsMultiTeam = {} as { [key: string]: Insights };
  const combo = {} as { [key: string]: Insights };

  for (const key in props.elimsMultiTeam) {
    elimsMultiTeam[key] = getInsightsType(props.seasonKey).fromJSON(props.elimsMultiTeam[key]);
  }

  for (const key in props.combo) {
    combo[key] = getInsightsType(props.seasonKey).fromJSON(props.combo[key]);
  }

  for (const key in props.qualsSingleTeam) {
    qualsSingleTeam[key] = getInsightsType(props.seasonKey).fromJSON(props.qualsSingleTeam[key]);
  }

  for (const key in props.qualsMultiTeam) {
    qualsMultiTeam[key] = getInsightsType(props.seasonKey).fromJSON(props.qualsMultiTeam[key]);
  }

  return {
    qualsSingleTeam,
    qualsMultiTeam,
    elimsMultiTeam,
    combo,
    seasonKey: props.seasonKey
  };
};

const getInsightsData = async (
  seasonKey: string | string[] | undefined,
  regionKey: string | string[] | undefined
): Promise<IRawInsightsProps> => {
  if (!seasonKey) seasonKey = CURRENT_SEASON;
  if (seasonKey && Array.isArray(seasonKey)) seasonKey = seasonKey[0];
  if (!regionKey || regionKey === 'all') regionKey = undefined;
  if (regionKey && Array.isArray(regionKey)) regionKey = regionKey[0];

  const optionalProps = regionKey && regionKey.length > 0 ? { region_key: regionKey } : {};

  /* Seasons where single-team matches are a thing */
  if (seasonKey === '2021' || seasonKey === '2122') {
    const data = await Promise.all([
      TOAProvider.getAPI().getSeasonInsights(seasonKey, {
        ...optionalProps,
        type: 'elims',
        single_team: 'excluded'
      }),
      TOAProvider.getAPI().getSeasonInsights(seasonKey, {
        ...optionalProps,
        type: 'quals',
        single_team: 'included'
      }),
      TOAProvider.getAPI().getSeasonInsights(seasonKey, {
        ...optionalProps,
        type: 'quals',
        single_team: 'only'
      }),
      TOAProvider.getAPI().getSeasonInsights(seasonKey, {
        ...optionalProps,
        type: 'quals',
        single_team: 'excluded'
      })
    ]);

    const qualsSingleTeam = {} as { [key: string]: any };
    const qualsMultiTeam = {} as { [key: string]: any };
    const elimsMultiTeam = {} as { [key: string]: any };
    const combo = {} as { [key: string]: any };

    for (const key in data[0]) {
      data[0][key].highScoreMatch = null;
      elimsMultiTeam[key] = undefinedToNull(data[0][key].toJSON());
    }

    for (const key in data[1]) {
      data[1][key].highScoreMatch = null;
      combo[key] = undefinedToNull(data[1][key].toJSON());
    }

    for (const key in data[2]) {
      data[2][key].highScoreMatch = null;
      qualsSingleTeam[key] = undefinedToNull(data[2][key].toJSON());
    }

    for (const key in data[3]) {
      data[3][key].highScoreMatch = null;
      qualsMultiTeam[key] = undefinedToNull(data[3][key].toJSON());
    }

    return {
      qualsSingleTeam,
      qualsMultiTeam,
      elimsMultiTeam,
      combo,
      seasonKey
    };

    /* Seasons where single-team matches are NOT a thing */
  } else {
    const data = await Promise.all([
      TOAProvider.getAPI().getSeasonInsights(seasonKey, {
        ...optionalProps,
        type: 'elims',
        single_team: 'excluded'
      }),
      TOAProvider.getAPI().getSeasonInsights(seasonKey, {
        ...optionalProps,
        type: 'quals',
        single_team: 'excluded'
      })
    ]);

    const qualsMultiTeam = {} as { [key: string]: any };
    const elimsMultiTeam = {} as { [key: string]: any };

    for (const key in data[0]) {
      data[0][key].highScoreMatch = null;
      elimsMultiTeam[key] = undefinedToNull(data[0][key].toJSON());
    }

    for (const key in data[1]) {
      data[1][key].highScoreMatch = null;
      qualsMultiTeam[key] = undefinedToNull(data[1][key].toJSON());
    }

    return {
      qualsSingleTeam: {},
      qualsMultiTeam,
      elimsMultiTeam,
      combo: {},
      seasonKey
    };
  }
};

export { parseInsightsProps, getInsightsData };
export type { IInsightsProps, IRawInsightsProps };
