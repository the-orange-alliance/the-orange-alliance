import { getMatchDetails as getLibMatchDetails } from '@the-orange-alliance/api/lib/cjs/models/game-specifics/GameData';
import { MatchDetails2627 } from './2627';

/** The match-details model for a season: this app's own for seasons
 * @the-orange-alliance/api does not carry yet, the package's for the rest. */
export const getMatchDetails = (seasonKey: string) =>
  seasonKey === '2627' ? new MatchDetails2627() : getLibMatchDetails(seasonKey);
