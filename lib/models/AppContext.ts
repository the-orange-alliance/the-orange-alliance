import { Event, League, Region, Season, Team } from '@the-orange-alliance/api/lib/cjs/models';

type TOAAppContext = {
  teams: Team[];
  events: Event[];
  seasons: Season[];
  regions: Region[];
  leagues: League[];
};

export default TOAAppContext;
