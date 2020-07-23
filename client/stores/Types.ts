/*
 * This is the interface for the current state of the application. At any
 * given time the state itself may not hold the most current up-to-date information.
 * At this point, it is the web application's job to recognize this, and update the state properly.
 */
export interface IApplicationState {
  eventsTotal: number;
  teamsTotal: number;
}

export const SET_TOTAL_EVENTS_COUNT: string = "SET_TOTAL_EVENTS_COUNT";
export type SET_TOTAL_EVENTS_COUNT = typeof SET_TOTAL_EVENTS_COUNT;

export const SET_TOTAL_TEAMS_COUNT: string = "SET_TOTAL_TEAMS_COUNT";
export type SET_TOTAL_TEAMS_COUNT = typeof SET_TOTAL_TEAMS_COUNT;