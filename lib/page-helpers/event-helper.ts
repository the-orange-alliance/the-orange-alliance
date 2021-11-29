import { useMemo } from 'react';
import {
  Event,
  Ranking,
  Match,
  Alliance,
  Insights,
  AwardRecipient,
  EventParticipant,
  EventLiveStream
} from '@the-orange-alliance/api/lib/cjs/models';
import { getInsightsType } from '@the-orange-alliance/api/lib/esm/models/game-specifics/InsightsData';
import TOAProvider from '../../providers/TOAProvider';
import { undefinedToNull } from '../utils/common';

export interface IRawEventProps {
  event: any;
  teams: any;
  rankings: any;
  matches: any;
  alliances: any;
  awards: any;
  insights: any;
  streams: any;
}

export interface IEventProps {
  event: Event;
  streams: EventLiveStream[];
}

export const parseEventProps = (props: IRawEventProps): IEventProps => {
  const event = new Event().fromJSON(props.event);
  event.teams = props.teams.map((t: any) => new EventParticipant().fromJSON(t));
  event.rankings = props.rankings.map((r: any) => new Ranking().fromJSON(r));
  event.matches = props.matches.map((m: any) => new Match().fromJSON(m));
  event.alliances = props.alliances.map((a: any) => new Alliance().fromJSON(a));
  event.awards = props.awards.map((a: any) => new AwardRecipient().fromJSON(a));
  event.insights = props.insights.map((i: any) =>
    i ? getInsightsType(event.seasonKey).fromJSON(i) : null
  );

  const streams = props.streams.map((s: any) => new EventLiveStream().fromJSON(s));
  return { event, streams };
};

export const useEventData = (props: IRawEventProps): IEventProps =>
  useMemo(() => parseEventProps(props), [props]);

export const fetchEventData = async (eventKey: string): Promise<IRawEventProps> => {
  const data = await Promise.all([
    TOAProvider.getAPI().getEvent(eventKey),
    TOAProvider.getAPI().getEventTeams(eventKey),
    TOAProvider.getAPI().getEventRankings(eventKey),
    TOAProvider.getAPI().getEventMatches(eventKey),
    TOAProvider.getAPI().getEventAlliances(eventKey),
    TOAProvider.getAPI().getEventAwards(eventKey),
    TOAProvider.getAPI().getEventInsights(eventKey, 'quals'),
    TOAProvider.getAPI().getEventInsights(eventKey, 'elims'),
    TOAProvider.getAPI().getEventStreams(eventKey)
  ]);

  const event = data[0];
  const teams = data[1].sort((a, b) => parseInt(a.teamKey) - parseInt(b.teamKey));
  const rankings = data[2];
  const matches = data[3];
  const alliances = data[4];
  const awards = data[5];
  const insights = [data[6][0], data[7][0]];
  const streams = data[8];

  const newInsights = [];
  for (const i of insights) {
    if (i) {
      const highScoreMatch = i.highScoreMatch;
      const insight = undefinedToNull(i.toJSON()) as any;
      if (highScoreMatch) insight.high_score_match = undefinedToNull(highScoreMatch.toJSON());
      newInsights.push(insight);
    } else {
      newInsights.push(null);
    }
  }

  return {
    event: undefinedToNull(event.toJSON()),
    teams: teams.map(t => undefinedToNull(t.toJSON())),
    rankings: rankings.map(r => undefinedToNull(r.toJSON())),
    matches: matches.map(m => undefinedToNull(m.toJSON())),
    alliances: alliances.map(a => undefinedToNull(a.toJSON())),
    awards: awards.map(a => undefinedToNull(a.toJSON())),
    insights: newInsights,
    streams: streams.map(s => undefinedToNull(s.toJSON()))
  };
};
