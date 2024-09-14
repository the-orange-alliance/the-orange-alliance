import { useMemo } from 'react';
import TOAProvider from '../../providers/toa-provider';
import { CURRENT_SEASON } from '../../constants';
import { undefinedToNull } from '../utils/common';
import { League, Region, Season } from '@the-orange-alliance/api/lib/cjs/models';

export interface IRawAppProps {
  seasons: any[];
  regions: any[];
  leagues: any[];
}

export interface IAppProps {
  seasons: Season[];
  regions: Region[];
  leagues: League[];
}

export const parseAppProps = (props: IRawAppProps): IAppProps => {
  return {
    seasons: props.seasons.map((s: any) => new Season().fromJSON(s)),
    regions: props.regions.map((r: any) => new Region().fromJSON(r)),
    leagues: props.leagues.map((l: any) => new League().fromJSON(l))
  };
};

export const useAppData = (props: IRawAppProps): IAppProps =>
  useMemo(() => parseAppProps(props), [props]);

export const fetchAppData = async (): Promise<IRawAppProps> => {
  const data = await Promise.all([
    TOAProvider.getAPI().getRegions(),
    TOAProvider.getAPI().getSeasons(),
    TOAProvider.getAPI().getLeagues(undefined, CURRENT_SEASON)
  ]);

  // Add "All Regions"
  const newRegion = new Region();
  newRegion.regionKey = 'all';
  newRegion.description = 'All Regions';
  data[0].splice(0, 0, newRegion);
  data[1].sort((a: Season, b: Season) => parseInt(b.seasonKey) - parseInt(a.seasonKey));
  return {
    seasons: data[1].map(s => undefinedToNull(s.toJSON())),
    regions: data[0].map(r => undefinedToNull(r.toJSON())),
    leagues: data[2].map(l => undefinedToNull(l.toJSON()))
  };
};
