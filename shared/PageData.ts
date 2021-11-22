import { IHomeProps, TOAProvider } from "./";
import Team from "@the-orange-alliance/api/lib/esm/models/Team";
import Event from "@the-orange-alliance/api/lib/esm/models/Event";
import Match from "@the-orange-alliance/api/lib/esm/models/Match";
import { IEventsProps, IRegionProps, ISeasonProps, ITeamsProps } from "./PageProperties";
import { Ranking, EventParticipant, Alliance, Insights, AwardRecipient } from "@the-orange-alliance/api/lib/esm/models";
import Season from "@the-orange-alliance/api/lib/esm/models/Season";
import Region from "@the-orange-alliance/api/lib/esm/models/Region";

export const currentSeason = "2122";

export async function getHomeData(prevProps: IHomeProps): Promise<IHomeProps> {
  const { eventSize, teamSize, highScoreMatches, matchSize } = prevProps;
  const promises: Promise<any>[] = [];

  if (eventSize <= 0) {
    promises.push(TOAProvider.getAPI().getEventCount({ season_key: currentSeason }));
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(eventSize))
    );
  }

  if (teamSize <= 0) {
    promises.push(TOAProvider.getAPI().getTeamCount({ last_active: currentSeason }));
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(teamSize))
    );
  }

  if (matchSize <= 0) {
    promises.push(TOAProvider.getAPI().getSeasonMatchCount({ season_key: currentSeason, played: true }));
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(teamSize))
    );
  }

  if (highScoreMatches.overall.matchKey.length <= 0) {
    promises.push(
      new Promise<any>(async (resolve, reject) => {
        try {
          const match: Match = await TOAProvider.getAPI().getHighScoreMatch("all", { seasonKey: currentSeason });
          match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
          match.participants = await TOAProvider.getAPI().getMatchParticipants(match.matchKey);
          resolve(match);
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(highScoreMatches.overall))
    );
  }

  if (highScoreMatches.quals.matchKey.length <= 0) {
    promises.push(
      new Promise<any>(async (resolve, reject) => {
        try {
          const match: Match = await TOAProvider.getAPI().getHighScoreMatch("quals", { seasonKey: currentSeason });
          match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
          match.participants = await TOAProvider.getAPI().getMatchParticipants(match.matchKey);
          resolve(match);
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(highScoreMatches.quals))
    );
  }

  if (highScoreMatches.elims.matchKey.length <= 0) {
    promises.push(
      new Promise<any>(async (resolve, reject) => {
        try {
          const match: Match = await TOAProvider.getAPI().getHighScoreMatch("elims", { seasonKey: currentSeason });
          match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
          match.participants = await TOAProvider.getAPI().getMatchParticipants(match.matchKey);
          resolve(match);
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(highScoreMatches.elims))
    );
  }

  return new Promise<IHomeProps>((resolve, reject) => {
    try {
      Promise.all(promises).then((results: any[]) => {
        resolve({
          eventSize: results[0],
          teamSize: results[1],
          matchSize: results[2],
          highScoreMatches: {
            overall: results[3],
            quals: results[4],
            elims: results[5]
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getTeamsData(prevProps: ITeamsProps): Promise<ITeamsProps> {
  const { teams } = prevProps;
  const promises: Promise<any>[] = [];

  if (teams.length <= 0) {
    promises.push(
      new Promise<any>((resolve, reject) => {
        try {
          TOAProvider.getAPI()
            .getTeams()
            .then((freshTeams: Team[]) => {
              resolve(freshTeams);
            });
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(teams))
    );
  }

  return new Promise<ITeamsProps>((resolve, reject) => {
    try {
      Promise.all(promises).then((results: any[]) => {
        resolve({ teams: results[0] });
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getRegionsData(prevProps: IRegionProps): Promise<IRegionProps> {
  const { regions } = prevProps;
  const promises: Promise<any>[] = [];

  if (regions.length <= 0) {
    promises.push(
      new Promise<any>((resolve, reject) => {
        try {
          TOAProvider.getAPI()
            .getRegions()
            .then((freshRegions: Region[]) => {
              resolve(freshRegions);
            });
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(regions))
    );
  }

  return new Promise<IRegionProps>((resolve, reject) => {
    try {
      Promise.all(promises).then((results: any[]) => {
        resolve({ regions: results[0] });
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getSeasonsData(prevProps: ISeasonProps): Promise<ISeasonProps> {
  const { seasons } = prevProps;
  const promises: Promise<any>[] = [];

  if (seasons.length <= 0) {
    promises.push(
      new Promise<any>((resolve, reject) => {
        try {
          TOAProvider.getAPI()
            .getSeasons()
            .then((freshSeasons: Season[]) => {
              resolve(freshSeasons);
            });
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(seasons))
    );
  }

  return new Promise<ISeasonProps>((resolve, reject) => {
    try {
      Promise.all(promises).then((results: any[]) => {
        resolve({ seasons: results[0] });
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getEventsData(prevProps: IEventsProps, seasonKey: string): Promise<IEventsProps> {
  let { events } = prevProps;
  const promises: Promise<any>[] = [];

  // Quick and dirty way to figure out what season we currently have
  if (events.length > 0 && events[0].seasonKey !== seasonKey) {
    // Requested season key does not match, invalidate data
    events = [];
  }

  if (events.length <= 0) {
    promises.push(
      new Promise<any>((resolve, reject) => {
        try {
          TOAProvider.getAPI()
            .getEvents({ season_key: seasonKey, includeTeamCount: true })
            .then((freshEvents: Event[]) => {
              resolve(freshEvents);
            });
        } catch (e) {
          reject(e);
        }
      })
    );
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(events))
    );
  }

  return new Promise<IEventsProps>((resolve, reject) => {
    try {
      Promise.all(promises).then((results: any[]) => {
        resolve({ events: results[0] });
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getEventData(eventCode: string): Promise<Event> {
  const event = await TOAProvider.getAPI().getEvent(eventCode);
  const teams = getEventTeams(eventCode);
  const rankings = getEventRankings(eventCode);
  const matches = getEventMatches(eventCode);
  const alliances = getEventAlliances(eventCode);
  const awards = getEventAwards(eventCode);
  const insights = getEventInsights(eventCode);
  event.rankings = await rankings;
  event.matches = await matches;
  event.teams = await teams;
  event.alliances = await alliances;
  event.awards = await awards;
  event.insights = await insights;
  return event;
}

export async function getEventMatches(eventCode: string): Promise<Match[]> {
  return await TOAProvider.getAPI().getEventMatches(eventCode);
}

export async function getEventRankings(eventCode: string): Promise<Ranking[]> {
  return await TOAProvider.getAPI().getEventRankings(eventCode);
}

export async function getEventTeams(eventCode: string): Promise<EventParticipant[]> {
  return (await TOAProvider.getAPI().getEventTeams(eventCode)).sort(
    (a, b) => parseInt(a.teamKey) - parseInt(b.teamKey)
  );
}

export async function getEventAlliances(eventCode: string): Promise<Alliance[]> {
  return await TOAProvider.getAPI().getEventAlliances(eventCode);
}

export async function getEventInsights(eventCode: string): Promise<Insights[]> {
  const qualInsights = (await TOAProvider.getAPI().getEventInsights(eventCode, "quals"))[0];

  const elimInsights = (await TOAProvider.getAPI().getEventInsights(eventCode, "elims"))[0];

  const resp: Insights[] = [];
  if (qualInsights !== undefined) resp.push(qualInsights);
  if (qualInsights === undefined && elimInsights !== undefined) resp.push(new Insights(), elimInsights);
  else if (elimInsights !== undefined) resp.push(elimInsights);

  return resp;
}

export async function getEventAwards(eventCode: string): Promise<AwardRecipient[]> {
  return await TOAProvider.getAPI().getEventAwards(eventCode);
}
