import { Link } from '@mui/material';
import { Match } from '@the-orange-alliance/api/lib/cjs/models';
import { getMatchWinner } from '@/lib/utils/common';

interface MatchNameDisplayProps {
  match: Match;
  isRemote?: boolean;
  onClick?: (match: Match) => void;
}

const getShortName = (match: Match) => {
  return match.matchName
    .replace(/Qual(?:s|ification\sMatch)?\s(\d+)/, 'Q-$1')
    .replace(/(Upper|Lower|Final) Bracket\s+Round \d+ Match (\d+)/, 'M-$2')
    .replace('Tiebreaker', '(TB)')
    .replace(/Semis (\d+) Match (\d+)/, 'SF$1-$2')
    .replace(/Final(?:s|\sMatch)?\s(\d+)/, 'F-$1');
};

const MatchNameDisplay: React.FC<MatchNameDisplayProps> = ({ match, isRemote, onClick }) => {
  const winner = getMatchWinner(match);
  const isPlayed = match.redScore > -1;
  return (
    <Link
      fontSize="1em"
      fontWeight={500}
      underline="none"
      textAlign="center"
      style={{
        display: 'block',
        color: isPlayed && !isRemote ? `var(--toa-colors-${winner})` : undefined,
        padding: '0.5em 0.5em'
      }}
      href={isPlayed ? `/matches/${match.matchKey}` : undefined}
      onClick={e => {
        if (onClick && isPlayed && !e.metaKey) {
          e.preventDefault();
          onClick(match);
        }
      }}
      tabIndex={-1}
    >
      {isRemote ? match.matchName : getShortName(match)}
    </Link>
  );
};

export default MatchNameDisplay;
