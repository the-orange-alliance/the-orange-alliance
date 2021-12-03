import { useMemo } from 'react';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';
import TOAProvider from '../../providers/TOAProvider';
import { CURRENT_SEASON } from '../../constants';
import { teamToStrippedJson, undefinedToNull } from '../utils/common';
import TOAAppContext from '../models/AppContext';
import { Event, League, Region, Season } from '@the-orange-alliance/api/lib/cjs/models';
import { eventToStrippedJson } from '../utils/event';

export interface IRawAppProps {
  events: any[];
  teams: any[];
  seasons: any[];
  regions: any[];
  leagues: any[];
}

export const parseAppProps = (props: IRawAppProps): TOAAppContext => {
  return {
    teams: props.teams.map((t: any) => new Team().fromJSON(t)),
    events: props.events.map((e: any) => new Event().fromJSON(e)),
    seasons: props.seasons.map((s: any) => new Season().fromJSON(s)),
    regions: props.regions.map((r: any) => new Region().fromJSON(r)),
    leagues: props.leagues.map((l: any) => new League().fromJSON(l))
  };
};

export const useAppData = (props: IRawAppProps): TOAAppContext =>
  useMemo(() => parseAppProps(props), [props]);

export const fetchAppData = async (): Promise<IRawAppProps> => {
  const data = await Promise.all([
    TOAProvider.getAPI().getRegions(),
    TOAProvider.getAPI().getSeasons(),
    TOAProvider.getAPI().getEvents({ season_key: CURRENT_SEASON }),
    TOAProvider.getAPI().getTeams(),
    TOAProvider.getAPI().getLeagues(undefined, CURRENT_SEASON)
  ]);

  // Add "All Regions"
  const newRegion = new Region();
  newRegion.regionKey = 'all';
  newRegion.description = 'All Regions';
  data[0].splice(0, 0, newRegion);
  data[1].sort((a: Season, b: Season) => parseInt(b.seasonKey) - parseInt(a.seasonKey));
  data[2].sort((a: Event, b: Event) => {
    const date1 = new Date(a.startDate);
    const date2 = new Date(b.startDate);
    return date1 > date2 ? 1 : date2 > date1 ? -1 : 0;
  });

  return {
    events: data[2].map(e => undefinedToNull(eventToStrippedJson(e))),
    seasons: data[1].map(s => undefinedToNull(s.toJSON())),
    regions: data[0].map(r => undefinedToNull(r.toJSON())),
    teams: data[3].map(t => undefinedToNull(teamToStrippedJson(t))),
    leagues: data[4].map(l => undefinedToNull(l.toJSON))
  };
};
