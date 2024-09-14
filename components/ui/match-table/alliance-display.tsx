import type { CSSProperties } from 'react';
import type { Match, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import MatchStations from '@the-orange-alliance/api/lib/cjs/models/types/MatchStations';
import { getMatchWinner } from '../../../lib/utils/common';
import MatchTeamDisplay from './team-display';

interface MatchAllianceDisplayProps {
  match: Match;
  color: 'red' | 'blue' | 'remote';
  teamWidth?: CSSProperties['width'];
  selectedTeamKey?: string;
  onTeamClick?: (team: MatchParticipant) => void;
}

const MatchAllianceDisplay: React.FC<MatchAllianceDisplayProps> = ({
  match,
  color,
  teamWidth,
  selectedTeamKey,
  onTeamClick
}) => {
  const matchWinner = getMatchWinner(match);
  const isWin = matchWinner === color;
  return (
    <>
      {match.participants
        .filter((team: MatchParticipant) => {
          if (color === 'red') {
            return team.station <= MatchStations.Red3;
          } else if (color === 'blue') {
            return team.station >= MatchStations.Blue1;
          } else {
            return true;
          }
        })
        .map((team: MatchParticipant) => (
          <MatchTeamDisplay
            key={team.matchParticipantKey}
            team={team}
            match={match}
            win={isWin}
            width={teamWidth}
            isRemote={color === 'remote'}
            isSelected={team.teamKey === selectedTeamKey}
            onClick={onTeamClick}
          />
        ))}
    </>
  );
};
export default MatchAllianceDisplay;
