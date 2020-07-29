import * as Types from './Types';
import { Reducer } from 'redux';
import {
  ApplicationActions,
  ISetHighScoreElims,
  ISetHighScoreOverall,
  ISetHighScoreQuals,
  ISetMatches,
  ISetTeams,
  ISetTotalEventSize,
  ISetTotalTeamSize
} from './Actions';
import Match from '@the-orange-alliance/api/lib/models/Match';

export const defaultState: Types.IApplicationState = {
  eventsTotal: 0,
  teamsTotal: 0,
  highScoreMatches: {
    quals: new Match(),
    elims: new Match(),
    overall: new Match()
  },
  matches: [],
  teams: []
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
    default:
      return state;
  }
};

export default reducer;
