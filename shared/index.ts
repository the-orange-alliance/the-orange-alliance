import {
  ApplicationActions,
  ISetHighScoreElims,
  ISetHighScoreOverall,
  ISetHighScoreQuals,
  ISetTotalEventSize,
  ISetTotalTeamSize,
  ISetTeams,
  ISetMatches,
  ISetEvents,
  setHighScoreElims,
  setHighScoreOverall,
  setHighScoreQuals,
  setTotalEventSize,
  setTotalTeamSize,
  setTeams,
  setMatches,
  setEvents,
  setEventData,
  setEventMatches,
  setEventRankings,
  setEventInsights
} from "./stores/Actions";
import * as Types from "./stores/Types";
import {
  IApplicationState,
  IApplicationStateJSON,
  IHighestScoringMatches,
  IHighestScoringMatchesJSON
} from "./stores/Types";
import Reducer, { defaultState } from "./stores/Reducer";
import TOAProvider from "./providers/TOAProvider";

import { IHomeProps, ITeamsProps, IEventsProps } from "./PageProperties";
import {
  getHomeData,
  getTeamsData,
  getEventsData,
  getEventData,
  getEventMatches,
  getEventRankings,
  getEventInsights,
  getEventAwards
} from "./PageData";

export {
  ApplicationActions,
  ISetHighScoreElims,
  ISetHighScoreOverall,
  ISetHighScoreQuals,
  ISetTotalEventSize,
  ISetTotalTeamSize,
  ISetMatches,
  ISetTeams,
  ISetEvents,
  setHighScoreElims,
  setHighScoreOverall,
  setHighScoreQuals,
  setTotalEventSize,
  setTotalTeamSize,
  setTeams,
  setMatches,
  setEvents,
  Types,
  Reducer,
  defaultState,
  IApplicationState,
  IApplicationStateJSON,
  IHighestScoringMatches,
  IHighestScoringMatchesJSON,
  TOAProvider,
  IHomeProps,
  ITeamsProps,
  IEventsProps,
  getHomeData,
  getTeamsData,
  getEventsData,
  getEventData,
  setEventData,
  getEventMatches,
  setEventMatches,
  getEventRankings,
  setEventRankings,
  getEventInsights,
  setEventInsights
};
