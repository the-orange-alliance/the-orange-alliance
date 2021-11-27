import { Match, Event, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { undefinedToNull } from '../../util/common-utils';
import { getMatchDetails } from '@the-orange-alliance/api/lib/cjs/models/game-specifics/GameData';

interface IRawMatchesProps {
  match: any;
  matchDetails: any;
  matchParticipants: any[];
  event: any;
}

interface IMatchesProps {
  match: Match;
}

const parseMatchesProps = (props: IRawMatchesProps): IMatchesProps => {
  const match = new Match().fromJSON(props.match);
  match.event = new Event().fromJSON(props.event);
  match.details = getMatchDetails(match.event.seasonKey).fromJSON(props.matchDetails);
  match.participants = props.matchParticipants.map((p: any) => new MatchParticipant().fromJSON(p));
  return {
    match: match
  };
};

const getMatchesData = async (matchKey: string): Promise<IRawMatchesProps> => {
  const split = matchKey.split('-');
  const data = await Promise.all([
    TOAProvider.getAPI().getMatch(matchKey),
    TOAProvider.getAPI().getMatchDetails(matchKey),
    TOAProvider.getAPI().getMatchParticipants(matchKey),
    TOAProvider.getAPI().getEvent(`${split[0]}-${split[1]}-${split[2]}`)
  ]);

  return {
    match: undefinedToNull(data[0].toJSON()),
    matchDetails: undefinedToNull(data[1].toJSON()),
    matchParticipants: data[2].map(p => undefinedToNull(p.toJSON())),
    event: undefinedToNull(data[3].toJSON())
  };
};

export { parseMatchesProps, getMatchesData };
export type { IMatchesProps, IRawMatchesProps };
