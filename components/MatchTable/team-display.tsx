import type { CSSProperties } from 'react';
import NextLink from 'next/link';
import { Link } from '@mui/material';
import type { Match, MatchParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import MatchStations from '@the-orange-alliance/api/lib/cjs/models/types/MatchStations';

interface MatchTeamDisplayProps {
  match: Match;
  team: MatchParticipant;
  win: boolean;
  width?: CSSProperties['width'];
  isRemote?: boolean;
  isSelected?: boolean;
  onClick?: (team: MatchParticipant) => void;
}

const MatchTeamDisplay: React.FC<MatchTeamDisplayProps> = ({
  match,
  team,
  win,
  width,
  isRemote,
  isSelected,
  onClick: handleClick
}) => {
  const alliance = team.station >= MatchStations.Blue1 ? 'blue' : 'red';
  return (
    <td
      style={{
        color: isSelected ? '#fff' : undefined,
        backgroundColor: isRemote
          ? isSelected
            ? 'var(--toa-colors-tie)'
            : undefined
          : isSelected
          ? `var(--toa-colors-${alliance})`
          : `var(--toa-colors-${alliance}-transparent)`,
        textAlign: 'center',
        // WebKit support
        minWidth: width,
        maxWidth: width
      }}
    >
      <NextLink href={`/teams/${team.teamKey}#${match.eventKey.toLowerCase()}`} passHref>
        <Link
          underline="none"
          sx={{
            display: 'block',
            color: 'inherit',
            textAlign: 'center',
            fontWeight: win ? 700 : undefined,
            padding: '0.5em 0.5em'
          }}
          aria-title={`View Team #${team.teamKey}}`}
          onClick={e => {
            if (handleClick && !e.metaKey) {
              e.preventDefault();
              handleClick(team);
            }
          }}
        >
          {team.teamKey}
        </Link>
      </NextLink>
    </td>
  );
};
export default MatchTeamDisplay;
