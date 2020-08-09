/**
 * PLEASE NOTE: Whatever changes you make in this file SHOULD be reflected in
 * their corresponding data requests over at PageData.ts
 *
 * Each page will still need to import the redux properties. This is merely a
 * way to keep structure between the server/client, and abstract their logic.
 */
import { IHighestScoringMatches } from './';
import Event from '@the-orange-alliance/api/lib/models/Event';
import Team from '@the-orange-alliance/api/lib/models/Team';

export interface IHomeProps {
  eventSize: number;
  teamSize: number;
  highScoreMatches: IHighestScoringMatches;
}

export interface ITeamsProps {
  teams: Team[];
}

export interface IEventsProps {
  events: Event[];
}
