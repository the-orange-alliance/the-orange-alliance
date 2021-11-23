import TOAProvider from "../../providers/TOAProvider";
import {CURRENT_SEASON} from "../../constants";
import {undefinedToNull} from "../../util/common-utils";
import {Event, Season, Region, Week} from "@the-orange-alliance/api/lib/cjs/models";

interface IRawEventsProps {
  events: any,
  seasons: any,
  regions: any,
  weeks: Week[]
}

interface IEventsProps {
  events: Event[],
  seasons: Season[],
  regions: Region[],
  weeks: Week[]
}

const parseEventsProps = (props: IRawEventsProps): IEventsProps => {
  return {
    events: props.events.map((e: any) => new Event().fromJSON(e)),
    seasons: props.seasons.map((s: any) => new Season().fromJSON(s)),
    regions: props.regions.map((r: any) => new Region().fromJSON(r)),
    weeks: props.weeks
  }
}

const getEventsData = async (seasonKey: string | string[] | undefined, regionKey: string | string[] | undefined): Promise<IRawEventsProps> => {
  if(!seasonKey) seasonKey = CURRENT_SEASON;
  if(seasonKey && Array.isArray(seasonKey)) seasonKey = seasonKey[0];
  if(!regionKey || regionKey === 'all') regionKey = undefined;
  if(regionKey && Array.isArray(regionKey)) regionKey = regionKey[0];

  const data = await Promise.all([
    TOAProvider.getAPI().getRegions(),
    TOAProvider.getAPI().getSeasons(),
    TOAProvider.getAPI().getEvents({season_key: seasonKey, region_key: regionKey})
  ]);

  // Add "All Regions"
  const newRegion = new Region();
  newRegion.regionKey = "all";
  newRegion.description = "All Regions";
  data[0].splice(0, 0, newRegion);
  data[1].sort((a: Season, b: Season) => parseInt(b.seasonKey) - parseInt(a.seasonKey));
  data[2].sort((a: Event, b: Event) => {
    const date1 = new Date(a.startDate);
    const date2 = new Date(b.startDate);
    return (date1 > date2) ? 1 : ((date2 > date1) ? -1 : 0);
  });

  // Weeks
  const weeks = organizeEventsByWeek(data[2]);

  return {
    events: data[2].map(e => undefinedToNull( e.toJSON())),
    seasons: data[1].map(s => undefinedToNull( s.toJSON())),
    regions: data[0].map(r => undefinedToNull( r.toJSON())),
    weeks: weeks,
  }
}

const organizeEventsByWeek = (events: Event[]): Week[] => {
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
}

export {parseEventsProps, getEventsData};
export type {IRawEventsProps, IEventsProps}