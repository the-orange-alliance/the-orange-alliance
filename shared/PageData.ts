import { IHomeProps, TOAProvider } from './';
import Match from '@the-orange-alliance/api/lib/models/Match';

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
