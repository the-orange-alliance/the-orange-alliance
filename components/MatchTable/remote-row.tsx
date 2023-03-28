import { Match, MatchParticipant, Ranking } from '@the-orange-alliance/api/lib/cjs/models';
import MatchVideoIcon from './video-icon';
import MatchNameDisplay from './name-display';
import MatchScoresDisplay from './scores-display';

interface MatchTableRemoteRowProps {
  match: Match;
  isStacked?: boolean;
  selectedTeam?: MatchParticipant | null;
  onTeamClick?: (participant: MatchParticipant) => void;
  onMatchClick?: (match: Match) => void;
}

const MatchTableRemoteRow: React.FC<MatchTableRemoteRowProps> = ({
  match,
  isStacked,
  selectedTeam,
  onTeamClick,
  onMatchClick
}) => {
  return (
    <tr className="toa-match-table__row">
      <td style={{ width: '8em' }}>
        <MatchVideoIcon videoUrl={match.videoURL} />
      </td>
      <td>
        <MatchNameDisplay match={match} onClick={onMatchClick} isRemote />
      </td>
      <td>
        <MatchScoresDisplay match={match} isRemote />
      </td>
    </tr>
  );
};

export default MatchTableRemoteRow;
