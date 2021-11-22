import * as Types from "./Types";
import { Reducer } from "redux";
import {
  ApplicationActions,
  ISetEvents,
  ISetHighScoreElims,
  ISetHighScoreOverall,
  ISetHighScoreQuals,
  ISetMatches,
  ISetTeams,
  ISetTotalEventSize,
  ISetTotalTeamSize,
  ISetTotalMatchSize,
  ISetEventData,
  ISetEventMatches,
  ISetEventRankings,
  ISetEventInsights,
  ISetRegions,
  ISetSeasons
} from "./Actions";
import Match from "@the-orange-alliance/api/lib/esm/models/Match";
import Event from "@the-orange-alliance/api/lib/esm/models/Event";

export const defaultState: Types.IApplicationState = {
  eventsTotal: 0,
  teamsTotal: 0,
  matchesTotal: 0,
  highScoreMatches: {
    quals: new Match(),
    elims: new Match(),
    overall: new Match()
  },
  matches: [],
  teams: [],
  events: [],
  regions: [],
  seasons: [],
  currentEvent: new Event(),
  currentEventInsights: []
};

const reducer: Reducer<Types.IApplicationState, ApplicationActions> = (
  state: Types.IApplicationState = defaultState,
  action: ApplicationActions
) => {
  switch (action.type) {
    case Types.SET_TOTAL_EVENTS_COUNT:
      action = action as ISetTotalEventSize;
      return { ...state, eventsTotal: action.payload.size };
    case Types.SET_TOTAL_TEAMS_COUNT:
      action = action as ISetTotalTeamSize;
      return { ...state, teamsTotal: action.payload.size };
    case Types.SET_TOTAL_MATCH_COUNT:
      action = action as ISetTotalMatchSize;
      return { ...state, matchesTotal: action.payload.size };
    case Types.SET_HIGH_SCORE_MATCH_OVERALL:
      action = action as ISetHighScoreOverall;
      return {
        ...state,
        highScoreMatches: {
          ...state.highScoreMatches,
          overall: action.payload.match
        }
      };
    case Types.SET_HIGH_SCORE_MATCH_QUALS:
      action = action as ISetHighScoreQuals;
      return {
        ...state,
        highScoreMatches: {
          ...state.highScoreMatches,
          quals: action.payload.match
        }
      };
    case Types.SET_HIGH_SCORE_MATCH_ELIMS:
      action = action as ISetHighScoreElims;
      return {
        ...state,
        highScoreMatches: {
          ...state.highScoreMatches,
          elims: action.payload.match
        }
      };
    case Types.SET_MATCHES:
      action = action as ISetMatches;
      return { ...state, matches: action.payload.matches };
    case Types.SET_TEAMS:
      action = action as ISetTeams;
      return { ...state, teams: action.payload.teams };
    case Types.SET_EVENTS:
      action = action as ISetEvents;
      return { ...state, events: action.payload.events };
    case Types.SET_EVENT_DATA:
      action = action as ISetEventData;
      return {
        ...state,
        currentEvent: action.payload.event
      };
    case Types.SET_EVENT_MATCHES:
      action = action as ISetEventMatches;
      state.currentEvent.matches = action.payload.matches;
      return { ...state, currentEvent: state.currentEvent };
    case Types.SET_EVENT_RANKINGS:
      action = action as ISetEventRankings;
      state.currentEvent.rankings = action.payload.rankings;
      return { ...state, currentEvent: state.currentEvent };
    case Types.SET_EVENT_INSIGHTS:
      action = action as ISetEventInsights;
      return { ...state, currentEventInsights: action.payload.insights };
    case Types.SET_REGIONS:
      action = action as ISetRegions;
      return { ...state, regions: action.payload.regions };
    case Types.SET_SEASONS:
      action = action as ISetSeasons;
      return { ...state, season: action.payload.seasons };
    default:
      return state;
  }
};

export default reducer;
