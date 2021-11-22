import TOAProvider from "../../providers/TOAProvider";
import {CURRENT_SEASON} from "../../constants";
import {undefinedToNull} from "../../util/common-utils";
import {Event, Season, Region} from "@the-orange-alliance/api/lib/cjs/models";

interface IRawEventsProps {
  events: any,
  seasons: any,
  regions: any,
}

interface IEventsProps {
  events: Event[],
  seasons: Season[],
  regions: Region[],
}

const parseEventsProps = (props: IRawEventsProps): IEventsProps => {
  return {
    events: props.events.map((e: any) => new Event().fromJSON(e)),
    seasons: props.seasons.map((s: any) => new Season().fromJSON(s)),
    regions: props.regions.map((r: any) => new Region().fromJSON(r))
  }
}

const getEventsData = async (): Promise<IRawEventsProps> => {
  const data = await Promise.all([
    TOAProvider.getAPI().getRegions(),
    TOAProvider.getAPI().getSeasons(),
    TOAProvider.getAPI().getEvents({season_key: CURRENT_SEASON})
  ]);

  return {
    events: data[2].map(e => undefinedToNull( e.toJSON())),
    seasons: data[1].map(s => undefinedToNull( s.toJSON())),
    regions: data[0].map(r => undefinedToNull( r.toJSON())),
  }
}

export {parseEventsProps, getEventsData};
export type {IRawEventsProps, IEventsProps}