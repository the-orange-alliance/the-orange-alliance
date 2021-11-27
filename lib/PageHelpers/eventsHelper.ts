import { useMemo } from 'react';
import { Event, Season, Region, Week } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { CURRENT_SEASON } from '../../constants';
import { undefinedToNull } from '../../util/common-utils';

export interface IRawEventsProps {
  events: any;
  seasons: any;
  regions: any;
}

export interface IEventsProps {
  events: Event[];
  seasons: Season[];
  regions: Region[];
}

export const parseEventsProps = (props: IRawEventsProps): IEventsProps => {
  return {
    events: props.events.map((e: any) => new Event().fromJSON(e)),
    seasons: props.seasons.map((s: any) => new Season().fromJSON(s)),
    regions: props.regions.map((r: any) => new Region().fromJSON(r)),
    weeks: props.weeks
  };
};

export const useEventsProps = (props: IRawEventsProps): IEventsProps =>
  useMemo(() => parseEventsProps(props), [props]);

export const getEventsData = async (): Promise<IRawEventsProps> => {
  const data = await Promise.all([
    TOAProvider.getAPI().getRegions(),
    TOAProvider.getAPI().getSeasons(),
    TOAProvider.getAPI().getEvents({ season_key: CURRENT_SEASON })
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
    events: data[2].map(e => undefinedToNull(e.toJSON())),
    seasons: data[1].map(s => undefinedToNull(s.toJSON())),
    regions: data[0].map(r => undefinedToNull(r.toJSON()))
  };
};

export const organizeEventsByWeek = (events: Event[]): Week[] => {
  const tempWeek = {} as { [key: string]: Week };
  for (const event of events) {
    if (tempWeek[event.weekKey] === undefined) {
      tempWeek[event.weekKey] = {
        weekKey: event.weekKey,
        startDate: event.startDate,
        endDate: event.endDate
      };
    } else {
      tempWeek[event.weekKey].endDate = event.endDate;
    }
  }
  return Object.values(tempWeek);
};
