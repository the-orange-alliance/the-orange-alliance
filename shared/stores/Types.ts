/*
 * This is the interface for the current state of the application. At any
 * given time the state itself may not hold the most current up-to-date information.
 * At this point, it is the web application's job to recognize this, and update the state properly.
 */
import Match from "@the-orange-alliance/api/lib/esm/models/Match";
import Team from "@the-orange-alliance/api/lib/esm/models/Team";
import Event from "@the-orange-alliance/api/lib/esm/models/Event";
import Insights from "@the-orange-alliance/api/lib/esm/models/Insights";
import Region from "@the-orange-alliance/api/lib/esm/models/Region";
import Season from "@the-orange-alliance/api/lib/esm/models/Season";

export interface IApplicationState {
  eventsTotal: number;
  teamsTotal: number;
  highScoreMatches: IHighestScoringMatches;
  matches: Match[];
  teams: Team[];
  events: Event[];
  regions: Region[];
  seasons: Season[];
  currentEvent: Event;
  currentEventInsights: Insights[];
}

export interface IApplicationStateJSON {
  eventsTotal: number;
  teamsTotal: number;
  highScoreMatches: IHighestScoringMatchesJSON;
  matches: any[];
  teams: any[];
  events: any[];
  currentEvent: Event;
  currentEventInsights: Insights[];
}

export interface IHighestScoringMatches {
  quals: Match;
  elims: Match;
  overall: Match;
}

export interface IHighestScoringMatchesJSON {
  quals: any;
  elims: any;
  overall: any;
}

export const SET_TOTAL_EVENTS_COUNT: string = "SET_TOTAL_EVENTS_COUNT";
export type SET_TOTAL_EVENTS_COUNT = typeof SET_TOTAL_EVENTS_COUNT;

export const SET_TOTAL_TEAMS_COUNT: string = "SET_TOTAL_TEAMS_COUNT";
export type SET_TOTAL_TEAMS_COUNT = typeof SET_TOTAL_TEAMS_COUNT;

export const SET_HIGH_SCORE_MATCH_OVERALL: string = "SET_HIGH_SCORE_MATCH_OVERALL";
export type SET_HIGH_SCORE_MATCH_OVERALL = typeof SET_HIGH_SCORE_MATCH_OVERALL;

export const SET_HIGH_SCORE_MATCH_QUALS: string = "SET_HIGH_SCORE_MATCH_QUALS";
export type SET_HIGH_SCORE_MATCH_QUALS = typeof SET_HIGH_SCORE_MATCH_QUALS;

export const SET_HIGH_SCORE_MATCH_ELIMS: string = "SET_HIGH_SCORE_MATCH_ELIMS";
export type SET_HIGH_SCORE_MATCH_ELIMS = typeof SET_HIGH_SCORE_MATCH_ELIMS;

export const SET_MATCHES: string = "SET_MATCHES";
export type SET_MATCHES = typeof SET_MATCHES;

export const SET_TEAMS: string = "SET_TEAMS";
export type SET_TEAMS = typeof SET_TEAMS;

export const SET_EVENTS: string = "SET_EVENTS";
export type SET_EVENTS = typeof SET_EVENTS;

export const SET_EVENT_DATA: string = "SET_EVENT_DATA";
export type SET_EVENT_DATA = typeof SET_EVENT_DATA;

export const SET_EVENT_MATCHES: string = "SET_EVENT_MATCHES";
export type SET_EVENT_MATCHES = typeof SET_EVENT_MATCHES;

export const SET_EVENT_RANKINGS: string = "SET_EVENT_RANKINGS";
export type SET_EVENT_RANKINGS = typeof SET_EVENT_RANKINGS;

export const SET_EVENT_INSIGHTS: string = "SET_EVENT_INSIGHTS";
export type SET_EVENT_INSIGHTS = typeof SET_EVENT_INSIGHTS;

export const SET_EVENT_AWARDS: string = "SET_EVENT_AWARDS";
export type SET_EVENT_AWARDS = typeof SET_EVENT_AWARDS;

export const SET_REGIONS: string = "SET_REGIONS";
export type SET_REGIONS = typeof SET_EVENT_AWARDS;

export const SET_SEASONS: string = "SET_SEASONS";
export type SET_SEASONS = typeof SET_SEASONS;
