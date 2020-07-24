import * as Types from './Types';
import { Action, ActionCreator } from 'redux';

export interface ISetTotalEventSize extends Action {
  type: Types.SET_TOTAL_EVENTS_COUNT;
  payload: { size: number };
}

export interface ISetTotalTeamSize extends Action {
  type: Types.SET_TOTAL_TEAMS_COUNT;
  payload: { size: number };
}

export const setTotalEventSize: ActionCreator<ISetTotalEventSize> = (
  size: number
) => ({
  type: Types.SET_TOTAL_EVENTS_COUNT,
  payload: { size }
});

export const setTotalTeamSize: ActionCreator<ISetTotalEventSize> = (
  size: number
) => ({
  type: Types.SET_TOTAL_TEAMS_COUNT,
  payload: { size }
});

export type ApplicationActions = ISetTotalEventSize | ISetTotalTeamSize;
