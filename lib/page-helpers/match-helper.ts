import { useMemo } from 'react';
import { Match, Event, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import { getMatchDetails } from '@the-orange-alliance/api/lib/cjs/models/game-specifics/GameData';
import TOAProvider from '../../providers/TOAProvider';
import { undefinedToNull } from '../utils/common';

export interface IRawMatchProps {
  match: any;
  matchDetails: any;
  matchParticipants: any[];
  event: any;
  ogImage?: string;
}

export interface IMatchProps {
  match: Match;
  ogImage?: string;
}

export const parseMatchProps = (props: IRawMatchProps): IMatchProps => {
  const match = new Match().fromJSON(props.match);
  match.event = new Event().fromJSON(props.event);
  match.details = getMatchDetails(match.event.seasonKey).fromJSON(props.matchDetails);
  match.participants = props.matchParticipants.map((p: any) => new MatchParticipant().fromJSON(p));
  return {
    match: match,
    ogImage: props.ogImage
  };
};

export const useMatchData = (props: IRawMatchProps): IMatchProps =>
  useMemo(() => parseMatchProps(props), [props]);

export const fetchMatchData = async (matchKey: string): Promise<IRawMatchProps> => {
  const split = matchKey.split('-');
  const data = await Promise.all([
    TOAProvider.getAPI(true).getMatch(matchKey),
    TOAProvider.getAPI(true).getMatchDetails(matchKey),
    TOAProvider.getAPI(true).getMatchParticipants(matchKey),
    TOAProvider.getAPI(true).getEvent(`${split[0]}-${split[1]}-${split[2]}`)
  ]);

  return {
    match: undefinedToNull(data[0].toJSON()),
    matchDetails: undefinedToNull(data[1].toJSON()),
    matchParticipants: data[2].map(p => undefinedToNull(p.toJSON())),
    event: undefinedToNull(data[3].toJSON())
  };
};
