import * as Types from './Types';
import { Reducer } from 'redux';
import {
  ApplicationActions,
  ISetTotalEventSize,
  ISetTotalTeamSize
} from './Actions';

export const defaultState: Types.IApplicationState = {
  eventsTotal: 0,
  teamsTotal: 0
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
    default:
      return state;
  }
};

export default reducer;
