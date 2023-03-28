import { Match, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import MatchVideoIcon from './video-icon';
import MatchNameDisplay from './name-display';
import MatchScoresDisplay from './scores-display';
import MatchAllianceDisplay from './alliance-display';

interface MatchTableRowProps {
  match: Match;
  isStacked?: boolean;
  selectedTeam?: MatchParticipant | null;
  onTeamClick?: (participant: MatchParticipant) => void;
  onMatchClick?: (match: Match) => void;
}

const MatchTableRow: React.FC<MatchTableRowProps> = ({
  match,
  isStacked,
  selectedTeam,
  onTeamClick,
  onMatchClick
}) => {
  return (
    <>
      {isStacked ? (
        <>
          <tr className="toa-match-table__row toa-match-table__row--stacked">
            <tr>
              <td className="toa-match-table__video" rowSpan={2} style={{ width: '2em' }}>
                <MatchVideoIcon videoUrl={match.videoURL} />
              </td>
              <td className="toa-match-table__name" rowSpan={2} style={{ width: '4em' }}>
                <MatchNameDisplay match={match} onClick={onMatchClick} />
              </td>
              <td className="toa-match-table__scores" rowSpan={2} style={{ width: '5em' }}>
                <MatchScoresDisplay match={match} onClick={onMatchClick} />
              </td>
              <MatchAllianceDisplay
                teamWidth={`calc((100% - 11em) / ${match.participants.length / 2})`}
                match={match}
                color="red"
                onTeamClick={onTeamClick}
                selectedTeamKey={selectedTeam?.teamKey}
              />
            </tr>
            <tr>
              <MatchAllianceDisplay
                teamWidth={`calc((100% - 11em) / ${match.participants.length / 2})`}
                match={match}
                color="blue"
                onTeamClick={onTeamClick}
                selectedTeamKey={selectedTeam?.teamKey}
              />
            </tr>
          </tr>
        </>
      ) : (
        <tr className="toa-match-table__row">
          <td style={{ width: '2.5em' }}>
            <MatchVideoIcon videoUrl={match.videoURL} />
          </td>
          <td style={{ width: '6em' }}>
            <MatchNameDisplay match={match} onClick={onMatchClick} />
          </td>
          <td style={{ width: '6em' }}>
            <MatchScoresDisplay match={match} onClick={onMatchClick} />
          </td>
          <MatchAllianceDisplay
            teamWidth={`calc((100% - 14.5em) / ${match.participants.length})`}
            match={match}
            color="red"
            onTeamClick={onTeamClick}
            selectedTeamKey={selectedTeam?.teamKey}
          />
          <MatchAllianceDisplay
            teamWidth={`calc((100% - 14.5em) / ${match.participants.length})`}
            match={match}
            color="blue"
            onTeamClick={onTeamClick}
            selectedTeamKey={selectedTeam?.teamKey}
          />
        </tr>
      )}
    </>
  );
};

export default MatchTableRow;
