import { useMemo } from 'react';
import { Match, Event, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '@/providers/toa-provider';
import { CURRENT_SEASON } from '@/constants';
import { undefinedToNull } from '@/lib/utils/common';

export interface IRawHomeProps {
  teamSize: number;
  matchSize: number;
  overallHighScoreMatch: any;
  qualsHighScoreMatch: any;
  elimsHighScoreMatch: any;
  overallHighScoreParticipants: any;
  qualsHighScoreParticipants: any;
  elimsHighScoreParticipants: any;
  overallHighScoreEvent: any;
  qualsHighScoreEvent: any;
  elimsHighScoreEvent: any;
  todaysEvents: any[];
}

export interface IHomeProps {
  teamSize: number;
  matchSize: number;
  overallHighScore: Match;
  qualsHighScore: Match;
  elimsHighScore: Match;
  todaysEvents: Event[];
}

export const getHighScoreMatch = (
  type: 'all' | 'elims' | 'quals' | 'single_team',
  penalty: boolean
): Promise<Match | undefined> => {
  return new Promise<Match | undefined>(async (resolve, reject) => {
    try {
      const match: Match = await TOAProvider.getAPI().getHighScoreMatch(type, {
        season_key: CURRENT_SEASON,
        penalty
      });
      if (match) {
        match.event = await TOAProvider.getAPI().getEvent(match.eventKey);
        resolve(match);
      } else {
        resolve(undefined);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const parseHomeProps = (props: IRawHomeProps): IHomeProps => {
  const overall = new Match().fromJSON(props.overallHighScoreMatch ?? {});
  overall.event = new Event().fromJSON(props.overallHighScoreEvent ?? {});
  overall.participants = props.overallHighScoreParticipants.map((p: any) =>
    new MatchParticipant().fromJSON(p)
  );

  const quals = new Match().fromJSON(props.qualsHighScoreMatch ?? {});
  quals.event = new Event().fromJSON(props.qualsHighScoreEvent ?? {});
  quals.participants = props.qualsHighScoreParticipants.map((p: any) =>
    new MatchParticipant().fromJSON(p)
  );

  const elims = new Match().fromJSON(props.elimsHighScoreMatch ?? {});
  elims.event = new Event().fromJSON(props.elimsHighScoreEvent ?? {});
  elims.participants = props.elimsHighScoreParticipants.map((p: any) =>
    new MatchParticipant().fromJSON(p)
  );
  return {
    matchSize: props.matchSize,
    teamSize: props.teamSize,
    overallHighScore: overall,
    qualsHighScore: quals,
    elimsHighScore: elims,
    todaysEvents: props.todaysEvents.map((e: any) => new Event().fromJSON(e))
  };
};

export const useHomeData = (props: IRawHomeProps): IHomeProps =>
  useMemo(() => parseHomeProps(props), [props]);

export const fetchHomeData = async (): Promise<IRawHomeProps> => {
  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const homePageResults = await Promise.all([
    TOAProvider.getAPI().getTeamCount({ last_active: CURRENT_SEASON }),
    TOAProvider.getAPI().getSeasonMatchCount({ season_key: CURRENT_SEASON, played: true }),
    getHighScoreMatch('all', true),
    getHighScoreMatch('quals', false),
    getHighScoreMatch('elims', false),
    TOAProvider.getAPI().getEvents({
      season_key: CURRENT_SEASON,
      on: today,
      includeTeamCount: true
    })
  ]);
  return {
    teamSize: homePageResults[0],
    matchSize: homePageResults[1],
    overallHighScoreMatch: undefinedToNull(homePageResults[2]?.toJSON()),
    qualsHighScoreMatch: undefinedToNull(homePageResults[3]?.toJSON()),
    elimsHighScoreMatch: undefinedToNull(homePageResults[4]?.toJSON()),
    overallHighScoreEvent: undefinedToNull(homePageResults[2]?.event.toJSON()),
    qualsHighScoreEvent: undefinedToNull(homePageResults[3]?.event.toJSON()),
    elimsHighScoreEvent: undefinedToNull(homePageResults[4]?.event.toJSON()),
    overallHighScoreParticipants:
      homePageResults[2]?.participants.map(p => undefinedToNull(p.toJSON())) ?? [],
    qualsHighScoreParticipants:
      homePageResults[3]?.participants.map(p => undefinedToNull(p.toJSON())) ?? [],
    elimsHighScoreParticipants:
      homePageResults[4]?.participants.map(p => undefinedToNull(p.toJSON())) ?? [],
    todaysEvents:
      homePageResults[5]?.map(e => ({
        ...undefinedToNull(e.toJSON()),
        match_count: e.matchCount,
        team_count: e.teamCount
      })) ?? []
  };
};
