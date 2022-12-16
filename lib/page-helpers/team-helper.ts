import { useMemo } from 'react';
import {
  AwardRecipient,
  Event,
  EventParticipant,
  Match,
  Media,
  Ranking,
  Season,
  Team
} from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { MatchSorter } from '../utils/match';
import { EventSorter } from '../utils/event';
import { sort } from '../utils/award';
import { MediaTypeTeam } from '@the-orange-alliance/api/lib/cjs/models/types/MediaType';
import { undefinedToNull } from '../utils/common';
import rankingTab from '../../components/EventTabs/RankingTab';

export interface IRawTeamProps {
  team: any;
  topOpr: any;
  wlt: { wins: number; losses: number; ties: number };
  media: any[];
  rankings: any[];
  events: any[];
  awards: any[];
  matches: any;
  ogImage?: string;
}

export interface ITeamProps {
  team: Team;
  topOpr: Ranking | null;
  matches: any;
  wlt: { wins: number; losses: number; ties: number };
  github: Media | null;
  cad: Media | null;
  notebook: Media | null;
  reveal: Media | null;
  images: Media[];
  ogImage: string;
}

export const parseTeamProps = (props: IRawTeamProps): ITeamProps => {
  const team = new Team().fromJSON(props.team);
  team.rankings = props.rankings.map((r: any) => new Ranking().fromJSON(r));
  team.events = props.events.map((e: any) => new Event().fromJSON(e));
  team.awards = props.awards.map((a: any) => new AwardRecipient().fromJSON(a));
  team.media = props.media.map((m: any) => new Media().fromJSON(m));

  for (const event of team.events) {
    // Map awards to event
    let awards = team.awards.filter(a => a.eventKey === event.eventKey);
    awards = sort(awards);

    event.awards = awards;

    // Map rankings to event
    event.rankings = team.rankings.filter(
      r => r.eventKey.toLowerCase() === event.eventKey.toLowerCase()
    );

    // Map matches to event
    event.matches = props.matches[event.eventKey].filter(
      (m: any) => m.event_key.toLowerCase() === event.eventKey.toLowerCase()
    );
    event.matches = event.matches.map((m: any) => new Match().fromJSON(m));
  }

  // Process Media
  const images = [];
  let github = null;
  let cad = null;
  let notebook = null;
  let reveal = null;
  if (team.media) {
    for (const media of team.media) {
      switch (media.mediaType) {
        case MediaTypeTeam.Github:
          github = media;
          break;
        case MediaTypeTeam.RobotReveal:
          reveal = media;
          break;
        case MediaTypeTeam.CAD:
          cad = media;
          break;
        case MediaTypeTeam.EngNotebook:
          notebook = media;
          break;
        case MediaTypeTeam.RobotImage:
          images.push(media);
          break;
      }
    }
  }

  return {
    team: team,
    topOpr: props.topOpr ? new Ranking().fromJSON(props.topOpr) : null,
    wlt: props.wlt,
    matches: props.matches,
    github: github,
    cad: cad,
    reveal: reveal,
    images: images,
    notebook: notebook,
    ogImage: props.ogImage as string
  };
};

export const useTeamData = (props: IRawTeamProps): ITeamProps =>
  useMemo(() => parseTeamProps(props), [props]);

export const fetchTeamData = async (teamKey: string, seasonKey: string): Promise<IRawTeamProps> => {
  const data = await Promise.all([
    TOAProvider.getAPI().getTeam(teamKey),
    TOAProvider.getAPI().getTeamEvents(teamKey, seasonKey),
    TOAProvider.getAPI().getTeamWLT(teamKey, { season_key: seasonKey }),
    TOAProvider.getAPI().getTeamMedia(teamKey, seasonKey),
    TOAProvider.getAPI().getTeamAwards(teamKey, seasonKey),
    TOAProvider.getAPI().getTeamRankings(teamKey, seasonKey)
  ]);

  // Get all team events for season
  const events = await Promise.all(
    data[1].map((result: EventParticipant) => {
      // Some teams are a part of orphaned events (I.E. The event key is invalid)
      // Catch those errors and return null
      return TOAProvider.getAPI()
        .getEvent(result.eventKey)
        .catch(() => null);
    })
  );

  // Sort out empty events
  const filtered = events.filter(
    result => typeof result !== 'undefined' && result !== null
  ) as Event[];

  // Fill events with data
  const matches = await getEventMatches(filtered, teamKey);

  // Calculate top OPR
  const topOpr = data[5].reduce((prev: Ranking, current: Ranking) => {
    return prev.opr > current.opr ? prev : current;
  });

  return {
    team: undefinedToNull(data[0].toJSON()),
    events: filtered.map(e => undefinedToNull(e.toJSON())),
    wlt: data[2],
    media: data[3].map(m => undefinedToNull(m.toJSON())),
    awards: data[4].map(a => undefinedToNull(a.toJSON())),
    rankings: data[5].map(r => undefinedToNull(r.toJSON())),
    matches: matches,
    topOpr: topOpr ? undefinedToNull(topOpr.toJSON()) : null
  };
};

const getTopOpr = (events: Ranking[]): Ranking | null => {
  let topOPR = new Ranking();
  for (const ranking of events) {
    if (ranking.opr > topOPR.opr) {
      topOPR = ranking;
    }
  }
  return topOPR.rankKey !== '' ? topOPR : null;
};

const getTeamSeasons = (seasons: Season[], team: Team): Season[] => {
  const lastActive = parseInt(team.lastActive);
  const rookieYearString = team.rookieYear.toString();
  const rookieYear2Digit = parseInt(rookieYearString[2] + rookieYearString[3]);
  const rookieYear = parseInt(rookieYear2Digit + '' + (rookieYear2Digit + 1));

  return seasons.filter(s => {
    const key = parseInt(s.seasonKey);
    return key >= rookieYear;
  });
};

const getEventMatches = async (events: Event[], teamKey: string): Promise<any[]> => {
  events = new EventSorter().sort(events).reverse();
  const responseMap = {} as any;

  await Promise.all(
    events.map(event =>
      TOAProvider.getAPI()
        .getEventMatches(event.eventKey)
        .then((data: Match[]) => {
          responseMap[event.eventKey] = sortAndFind(teamKey, data).map(m =>
            undefinedToNull(m.toJSON())
          );
        })
    )
  );
  return responseMap;
};

const sortAndFind = (teamKey: string, matches: Match[]): Match[] => {
  let teamMatches = [];
  for (const match of matches) {
    for (const team of match.participants) {
      if (team.teamKey === teamKey) {
        teamMatches.push(match);
      }
    }
  }

  const sorter = new MatchSorter();
  teamMatches = sorter.sort(teamMatches, 0, teamMatches.length - 1);
  return teamMatches;
};
