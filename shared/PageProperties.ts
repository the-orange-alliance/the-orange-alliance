/**
 * PLEASE NOTE: Whatever changes you make in this file SHOULD be reflected in
 * their corresponding data requests over at PageData.ts
 *
 * Each page will still need to import the redux properties. This is merely a
 * way to keep structure between the server/client, and abstract their logic.
 */
import { IHighestScoringMatches } from './';

export interface IHomeProps {
  eventSize: number;
  teamSize: number;
  highScoreMatches: IHighestScoringMatches;
}
