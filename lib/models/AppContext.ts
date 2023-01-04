import { League, Region, Season } from '@the-orange-alliance/api/lib/cjs/models';
import TOAUser from '../TOAUser';

type TOAAppContext = {
  seasons: Season[];
  regions: Region[];
  leagues: League[];
  user: TOAUser | null;
  setUser: (user: TOAUser | null) => void;
};

export default TOAAppContext;
