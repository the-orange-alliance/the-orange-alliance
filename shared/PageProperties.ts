/**
 * PLEASE NOTE: Whatever changes you make in this file SHOULD be reflected in
 * their corresponding data requests over at PageData.ts
 *
 * Each page will still need to import the redux properties. This is merely a
 * way to keep structure between the server/client, and abstract their logic.
 */
import { IHighestScoringMatches } from "./";
import Event from "@the-orange-alliance/api/lib/esm/models/Event";
import Team from "@the-orange-alliance/api/lib/esm/models/Team";
import Season from "@the-orange-alliance/api/lib/esm/models/Season";
import Region from "@the-orange-alliance/api/lib/esm/models/Region";

export interface IHomeProps {
  eventSize: number;
  teamSize: number;
  matchSize: number;
  highScoreMatches: IHighestScoringMatches;
}

export interface ITeamsProps {
  teams: Team[];
}

export interface IEventsProps {
  events: Event[];
}

export interface IRegionProps {
  regions: Region[];
}

export interface ISeasonProps {
  seasons: Season[];
}
