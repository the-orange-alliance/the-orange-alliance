import { IHomeProps, TOAProvider } from './';
import Team from '@the-orange-alliance/api/lib/models/Team';
import Event from '@the-orange-alliance/api/lib/models/Event';
import Match from '@the-orange-alliance/api/lib/models/Match';
import { IEventsProps, ITeamsProps } from './PageProperties';

export async function getHomeData(prevProps: IHomeProps): Promise<IHomeProps> {
  const { eventSize, teamSize, highScoreMatches } = prevProps;
  const promises: Array<Promise<any>> = [];

  if (eventSize <= 0) {
    promises.push(TOAProvider.getAPI().getEventCount());
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(eventSize))
    );
  }

  if (teamSize <= 0) {
    promises.push(TOAProvider.getAPI().getTeamCount());
  } else {
    promises.push(
      new Promise<any>((resolve) => resolve(teamSize))
    );
  }

  if (highScoreMatches.overall.matchKey.length <= 0) {
    promises.push(
      new Promise<any>(async (resolve, reject) => {
        try {
          const match: Match = await TOAProvider.getAPI().getHighScoreMatch(
            'all'
          );
          match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
          match.participants = await TOAProvider.getAPI().getMatchParticipants(
            match.matchKey
          );
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
          const match: Match = await TOAProvider.getAPI().getHighScoreMatch(
            'quals'
          );
          match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
          match.participants = await TOAProvider.getAPI().getMatchParticipants(
            match.matchKey
          );
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
          const match: Match = await TOAProvider.getAPI().getHighScoreMatch(
            'elims'
          );
          match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
          match.participants = await TOAProvider.getAPI().getMatchParticipants(
            match.matchKey
          );
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
          highScoreMatches: {
            overall: results[2],
            quals: results[3],
            elims: results[4]
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getTeamsData(
  prevProps: ITeamsProps
): Promise<ITeamsProps> {
  const { teams } = prevProps;
  const promises: Array<Promise<any>> = [];

  if (teams.length <= 0) {
    promises.push(
      new Promise<any>((resolve, reject) => {
        try {
          TOAProvider.getAPI()
            .getTeams()
            .then((teams: Team[]) => {
              resolve(teams);
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

export async function getEventsData(
  prevProps: IEventsProps
): Promise<IEventsProps> {
  const { events } = prevProps;
  const promises: Array<Promise<any>> = [];

  if (events.length <= 0) {
    promises.push(
      new Promise<any>((resolve, reject) => {
        try {
          TOAProvider.getAPI()
            .getEvents()
            .then((events: Event[]) => {
              resolve(events);
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
