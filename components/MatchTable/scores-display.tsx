import { Match } from '@the-orange-alliance/api/lib/cjs/models';
import { useUserLanguage } from '../../i18n/i18n';
import { getMatchWinner, isSameDay } from '../../lib/utils/common';

interface MatchScoresDisplayProps {
  match: Match;
  isRemote?: boolean;
}

const MatchScoresDisplay: React.FC<MatchScoresDisplayProps> = ({ match, isRemote }) => {
  const winner = getMatchWinner(match);
  const isPlayed = match.redScore > -1;
  const language = useUserLanguage();
  const time = new Date(match.scheduledTime);
  const isToday = isSameDay(time, new Date());
  const scheduledTime =
    isPlayed || isNaN(time.getTime())
      ? ''
      : isToday
      ? time.toLocaleTimeString(`${language}-US`, { hour: 'numeric', minute: 'numeric' })
      : time.toLocaleDateString(`${'language'}-US`, { weekday: 'short' }) +
        ' ' +
        time.toLocaleTimeString(`${language}-US`, { hour: 'numeric', minute: 'numeric' });

  return (
    <span>
      {isPlayed && isRemote ? (
        <span style={{ fontWeight: 500 }}>{match.redScore}</span>
      ) : isPlayed ? (
        <>
          <span
            style={
              winner === 'red'
                ? {
                    color: 'var(--toa-colors-red)',
                    fontWeight: 700
                  }
                : undefined
            }
          >
            {match.redScore}
          </span>{' '}
          -{' '}
          <span
            style={
              winner === 'blue'
                ? {
                    color: 'var(--toa-colors-blue)',
                    fontWeight: 700
                  }
                : undefined
            }
          >
            {match.blueScore}
          </span>
        </>
      ) : (
        scheduledTime
      )}
    </span>
  );
};

export default MatchScoresDisplay;
